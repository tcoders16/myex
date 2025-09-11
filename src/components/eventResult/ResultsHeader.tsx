// src/components/ResultsHeader.tsx
import { AlertTriangle } from "lucide-react";

export default function ResultsHeader({
  count,
  loading,
  degraded,
}: {
  count: number;
  loading?: boolean;
  degraded?: boolean;
}) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-100 p-5">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">Extracted Events</h3>
          <p className="text-xs text-zinc-500">From backend response</p>
        </div>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700">
          {loading ? "parsing…" : `${count} found`}
        </span>
      </div>

      {degraded && (
        <div className="mx-5 mt-4 mb-2 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2 text-amber-800 text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>Degraded mode: fallback used (LLM timeout/bad JSON/etc).</span>
        </div>
      )}
    </>
  );
}