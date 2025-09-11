// src/api/google.ts
import type { GoogleEventPayload } from "../utils/eventFrom";

export type CreateEventOk  = { ok: true; id?: string; htmlLink?: string };
export type CreateEventErr = { ok: false; error: string };
export type CreateEventResp = CreateEventOk | CreateEventErr;

// If VITE_API_BASE is set (e.g., "http://localhost:4000") we'll use it,
// otherwise fall back to relative path (useful if you reverse-proxy /api).
const API_BASE: string = (import.meta as any).env?.VITE_API_BASE || "";

const DEFAULT_TIMEOUT_MS = 15_000;

// function withTimeout<T>(p: Promise<T>, ms = DEFAULT_TIMEOUT_MS): Promise<T> {
//   const ac = new AbortController();
//   const t = setTimeout(() => ac.abort(), ms);
//   // attach signal to a fetch inside the caller
//   // we return both promise & controller to the caller, but to keep it simple
//   // we wrap fetch below instead. See call site.
//   // (Kept here for clarity / reuse if needed.)
//   return new Promise<T>((resolve, reject) => {
//     p.then((v) => (clearTimeout(t), resolve(v))).catch((e) => (clearTimeout(t), reject(e)));
//   });
// }

/**
 * Call backend -> backend calls Google Calendar.
 * Sends token in Authorization header (Bearer).
 */
export async function createCalendarEvent(
  accessToken: string,
  payload: GoogleEventPayload,
  calendarId: string = "primary"
): Promise<CreateEventResp> {
  const url = `${API_BASE}/api/google/events`;
  const hasBase = Boolean(API_BASE);
  console.log("[API] createCalendarEvent → POST", url, {
    calendarId,
    hasToken: !!accessToken,
    usingBase: hasBase ? API_BASE : "(relative /api)",
  });

  // Build request with an AbortController for timeout
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // server expects this
      },
      body: JSON.stringify({ calendarId, event: payload }),
      signal: ac.signal,
    }).catch((e) => {
      // Normalize immediate network errors
      throw e?.name === "AbortError" ? new Error("CLIENT_TIMEOUT") : e;
    });

    clearTimeout(timer);

    // Try to parse JSON; if it fails, log the raw text for debugging
    let j: any = null;
    try {
      j = await r.json();
    } catch {
      try {
        const raw = await r.text();
        console.warn("[API] non-JSON response:", raw?.slice(0, 200));
      } catch {
        /* ignore */
      }
    }

    // Normalize errors
    if (!r.ok || j?.ok === false) {
      if (r.status === 401 || j?.error === "TOKEN_EXPIRED") {
        console.warn("[API] token expired (401/TOKEN_EXPIRED)");
        return { ok: false, error: "TOKEN_EXPIRED" };
      }
      const errMsg = j?.error || `${r.status} ${r.statusText}`;
      console.error("[API] backend error:", errMsg);
      return { ok: false, error: errMsg };
    }

    // Success path
    const id = j?.id ?? j?.event?.id;
    const htmlLink = j?.htmlLink ?? j?.event?.htmlLink;
    console.log("[API] success", { id, htmlLink });
    return { ok: true, id, htmlLink };
  } catch (err: any) {
    clearTimeout(timer);
    const msg = err?.message || "NETWORK_ERROR";
    console.error("[API] fetch failed:", msg);
    return { ok: false, error: msg };
  }
}