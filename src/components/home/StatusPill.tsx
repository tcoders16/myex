// ========== file: src/components/home/StatusPill.tsx ==========
export default function StatusPill({ ok, loading }: { ok: boolean; loading: boolean }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs text-zinc-700 shadow-sm backdrop-blur">
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${loading ? "bg-amber-500 animate-ping" : ok ? "bg-emerald-500 animate-ping" : "bg-rose-500 animate-ping"}`} />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${loading ? "bg-amber-600" : ok ? "bg-emerald-600" : "bg-rose-600"}`} />
      </span>
      {loading ? "Connecting…" : ok ? "Backend online" : "Backend offline"}
    </div>
  );
}