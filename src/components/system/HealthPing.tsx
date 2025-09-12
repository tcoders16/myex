// src/components/system/HealthPing.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, WifiOff } from "lucide-react";

type Ping = { t: number; ms: number; ok: boolean };

export default function HealthPing({ url = "/api/healthz", everyMs = 7000 }) {
  const [pings, setPings] = useState<Ping[]>([]);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    let abort = false;

    async function tick() {
      const started = performance.now();
      try {
        const r = await fetch(url, { cache: "no-store" });
        const ms = Math.round(performance.now() - started);
        if (abort) return;
        setPings((prev) => [...prev.slice(-15), { t: Date.now(), ms, ok: r.ok }]);
      } catch {
        if (abort) return;
        const ms = Math.round(performance.now() - started);
        setPings((prev) => [...prev.slice(-15), { t: Date.now(), ms, ok: false }]);
      }
    }

    tick();
    timer.current = window.setInterval(tick, everyMs);
    return () => {
      abort = true;
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [url, everyMs]);

  const last = pings[pings.length - 1];
  const avg = useMemo(
    () => Math.round(pings.reduce((a, p) => a + p.ms, 0) / Math.max(1, pings.length)),
    [pings]
  );

  const color =
    !last ? "bg-zinc-300" :
    !last.ok ? "bg-red-500" :
    avg < 180 ? "bg-emerald-500" :
    avg < 350 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/80 px-3 py-2 text-xs text-zinc-700">
      {last?.ok ? <Activity className="h-4 w-4 text-emerald-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
      <span className="font-medium">{last?.ok ? "Backend online" : "Backend down"}</span>
      <span className="mx-2 h-1 w-14 overflow-hidden rounded-full bg-zinc-200">
        <motion.span
          key={avg}
          className={`block h-1 ${color}`}
          initial={{ width: "0%" }}
          animate={{ width: `${Math.min(100, avg / 4)}%` }}
          transition={{ type: "spring", stiffness: 150, damping: 18 }}
        />
      </span>
      <span className="tabular-nums">{avg || "–"} ms</span>
    </div>
  );
}