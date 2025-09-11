// src/hooks/useLatestExtract.ts
// pull events from backend and show on UI
import { useEffect, useRef, useState } from "react";
import type { ExtractionResult } from "../types/extract";

export function useLatestExtract(apiBase: string) {
  const [data, setData] = useState<ExtractionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  // simple polling of your ip-scoped latest cache
  async function tick() {
    try {
      const r = await fetch(`${apiBase}/api/extract/latest`, { cache: "no-store" });
      if (!r.ok) throw new Error(`${r.status}`);
      const json = (await r.json()) as { ok: boolean; data?: ExtractionResult };
      if (json?.data) setData(json.data);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "fetch failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    tick();
    timer.current = window.setInterval(tick, 2000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [apiBase]);

  return { data, loading, error };
}