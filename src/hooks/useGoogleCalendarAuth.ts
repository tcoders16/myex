// src/hooks/useGoogleCalendarAuth.ts
/// <reference types="google.accounts" />
import { useCallback, useEffect, useRef, useState } from "react";

const SCOPES = "https://www.googleapis.com/auth/calendar.events";
const TOKEN_BUFFER_MS = 60_000;
const GIS_SRC = "https://accounts.google.com/gsi/client";
const LS_KEY = "gcalAuth:v1";

// ---------- Debug helpers ----------
function log(...args: any[])  { console.log("%c[Auth]", "color:#2563eb", ...args); }
function warn(...args: any[]) { console.warn("%c[Auth]", "color:#b45309", ...args); }
function err(...args: any[])  { console.error("%c[Auth]", "color:#dc2626", ...args); }

function exposeDebug(obj: Record<string, any>) {
  (window as any).__gcalAuth = { ...(window as any).__gcalAuth, ...obj };
}

// ---------- GIS bootstrap ----------
async function loadGisScript(): Promise<void> {
  if ((window as any).google?.accounts?.oauth2) return;

  const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`);
  if (existing) {
    await new Promise<void>((resolve) => {
      if ((window as any).google?.accounts?.oauth2) return resolve();
      existing.addEventListener("load", () => resolve(), { once: true });
      setTimeout(() => resolve(), 0);
    });
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = GIS_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Google Identity Services script"));
    document.head.appendChild(s);
  });
}

async function waitForGoogle(timeoutMs = 8000): Promise<void> {
  if ((window as any).google?.accounts?.oauth2) return;
  await loadGisScript();

  await new Promise<void>((resolve, reject) => {
    const start = Date.now();
    const id = setInterval(() => {
      if ((window as any).google?.accounts?.oauth2) {
        clearInterval(id);
        resolve();
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(id);
        reject(new Error("Google Identity Services failed to load"));
      }
    }, 50);
  });
}

// ---------- Types ----------
export type GoogleAuthState = {
  token: string | null;
  loading: boolean;
  error: string | null;
};

export type UseGoogleCalendarAuth = GoogleAuthState & {
  ensureToken: () => Promise<string>;             // silent → popup fallback
  getTokenSilent: () => Promise<string>;          // silent only
  requestTokenInteractive: () => Promise<string>; // force popup
  revoke: () => Promise<void>;
};

// ---------- Hook ----------
export function useGoogleCalendarAuth(): UseGoogleCalendarAuth {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  const [token, setToken] = useState<string | null>(null);
  const [expiryMs, setExpiryMs] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tokenClientRef = useRef<google.accounts.oauth2.TokenClient | null>(null);

  // Restore from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const { token: t, expiryMs: e } = JSON.parse(raw || "{}");
      if (t && typeof e === "number" && Date.now() < e - TOKEN_BUFFER_MS) {
        setToken(t);
        setExpiryMs(e);
        log("Restored token from localStorage");
      } else {
        localStorage.removeItem(LS_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem(LS_KEY, JSON.stringify({ token, expiryMs }));
    } else {
      localStorage.removeItem(LS_KEY);
    }
  }, [token, expiryMs]);

  // Init token client
  const ensureClient = useCallback(async (): Promise<google.accounts.oauth2.TokenClient> => {
    if (!clientId) {
      const msg = "Missing VITE_GOOGLE_CLIENT_ID";
      err(msg);
      throw new Error(msg);
    }
    if (tokenClientRef.current) return tokenClientRef.current;

    await waitForGoogle();
    const oauth2 = (window as any).google?.accounts?.oauth2;
    if (!oauth2) throw new Error("Google Identity Services not available after load");

    tokenClientRef.current = oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES, // callback assigned per request
    });

    if (!tokenClientRef.current) throw new Error("Failed to init Google TokenClient");
    exposeDebug({ tokenClient: tokenClientRef.current });
    return tokenClientRef.current;
  }, [clientId]);

  // Token validity check
  const hasValidToken = useCallback(() => {
    const ok = Boolean(token) && Date.now() < expiryMs - TOKEN_BUFFER_MS;
    return ok;
  }, [token, expiryMs]);

  // Core request
  const requestToken = useCallback(
    async (interactive: boolean): Promise<string> => {
      const client = await ensureClient();
      setLoading(true);
      setError(null);

      try {
        const newToken = await new Promise<string>((resolve, reject) => {
          try {
            (client as any).callback = (resp: any) => {
              if (resp?.error) {
                reject(new Error(resp.error));
                return;
              }
              const accessToken = String(resp.access_token ?? "");
              const expiresInSec = Number(resp.expires_in ?? 3600);
              if (!accessToken) {
                reject(new Error("NO_ACCESS_TOKEN"));
                return;
              }
              setToken(accessToken);
              setExpiryMs(Date.now() + expiresInSec * 1000);
              resolve(accessToken);
            };

            const opts: google.accounts.oauth2.OverridableTokenClientConfig = {};
            if (interactive) opts.prompt = "consent";
            client.requestAccessToken(opts);
          } catch (e) {
            reject(e instanceof Error ? e : new Error("TOKEN_REQUEST_FAILED"));
          }
        });

        return newToken;
      } catch (e: any) {
        const message = e?.message || "TOKEN_REQUEST_FAILED";
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [ensureClient]
  );

  // Public helpers
  const ensureToken = useCallback(async (): Promise<string> => {
    if (hasValidToken()) return token!;
    try {
      return await requestToken(false); // silent first
    } catch (e: any) {
      warn("Silent token fetch failed, opening popup:", e?.message);
      const t = await requestToken(true); // then interactive
      return t;
    }
  }, [hasValidToken, token, requestToken]);

  const getTokenSilent = useCallback(async (): Promise<string> => {
    if (hasValidToken()) return token!;
    return await requestToken(false);
  }, [hasValidToken, token, requestToken]);

  const requestTokenInteractive = useCallback(async (): Promise<string> => {
    return requestToken(true);
  }, [requestToken]);

  const revoke = useCallback(async () => {
    const t = token;
    setToken(null);
    setExpiryMs(0);
    setError(null);
    try {
      const api = (window as any).google?.accounts?.oauth2;
      if (t && api?.revoke) {
        await new Promise<void>((r) => api.revoke(t, r));
        log("Token revoked at Google");
      }
    } catch (e) {
      warn("revoke() error ignored:", (e as any)?.message);
    }
  }, [token]);

  // Warm-up client early
  useEffect(() => {
    (async () => {
      try {
        if (!clientId) {
          warn("VITE_GOOGLE_CLIENT_ID is not set");
          return;
        }
        await ensureClient();
      } catch (e: any) {
        const m = e?.message ?? "Google client init failed";
        err("Warm-up failed:", m);
        setError(m);
      }
    })();
  }, [clientId, ensureClient]);

  // Pre-expiry staleness mark
  useEffect(() => {
    if (!token) return;
    const msLeft = Math.max(0, expiryMs - Date.now() - TOKEN_BUFFER_MS);
    const id = setTimeout(() => setExpiryMs(0), msLeft);
    return () => clearTimeout(id);
  }, [token, expiryMs]);

  exposeDebug({
    get state() {
      return { token, expiryMs, loading, error };
    },
    ensureToken,
    getTokenSilent,
    requestTokenInteractive,
    revoke,
  });

  return {
    token,
    loading,
    error,
    ensureToken,
    getTokenSilent,
    requestTokenInteractive,
    revoke,
  };
}