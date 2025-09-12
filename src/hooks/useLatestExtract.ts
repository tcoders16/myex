// src/hooks/useLatestExtract.ts
import { useEffect, useRef, useState } from "react";
import type { ExtractionResult } from "../types/extract";

// --- helpers ---
function normalizeBase(raw?: string) {
  const b = (raw || "").trim().replace(/\/+$/, ""); // drop trailing slashes
  return b;
}

// Pick backend base automatically (prefer env)
const ENV_BASE = normalizeBase(import.meta.env.VITE_API_BASE);
// If no env is set, use your deployed backend (HTTPS) as a safe default:
const DEFAULT_BASE = "https://myexbackend.onrender.com";
const VITE_API_BASE = ENV_BASE || DEFAULT_BASE;

export function useLatestExtract(base: string = VITE_API_BASE) {
  const [data, setData] = useState<ExtractionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const tries = useRef(0);

  async function tick() {
    try {
      const r = await fetch(`${normalizeBase(base)}/api/extract/latest`, {
        cache: "no-store",
      });
      if (!r.ok) throw new Error(String(r.status));
      const json = (await r.json()) as { ok: boolean; data?: ExtractionResult };
      if (json?.data) setData(json.data);
      setError(null);
      tries.current = 0; // reset backoff on success
    } catch (e: any) {
      setError(e?.message || "fetch failed");
      // simple backoff so we don't hammer a down backend
      tries.current = Math.min(tries.current + 1, 10);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // warn if someone is accidentally using an http:// localhost base on an https page
    if (typeof window !== "undefined" &&
        window.location.protocol === "https:" &&
        /^http:\/\//i.test(base)) {
      console.warn("[useLatestExtract] In HTTPS context, HTTP backend will be blocked. Use HTTPS base (e.g. Render URL).");
    }

    tick();
    // poll with a tiny backoff when errors happen
    const loop = () => {
      const ms = 2000 * (1 + tries.current * 0.5); // 2s, 3s, 4s, ...
      timer.current = window.setTimeout(async () => {
        await tick();
        loop();
      }, ms) as unknown as number;
    };
    loop();

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [base]);

  return { data, loading, error };
}