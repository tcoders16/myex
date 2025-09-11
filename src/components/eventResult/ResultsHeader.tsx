// src/components/ResultsHeader.tsx
import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, CheckCircle2 } from "lucide-react";

type Props = {
  count: number;
  loading?: boolean;
  degraded?: boolean;
  /** optional: show a small refresh button */
  onRefresh?: () => void | Promise<void>;
};

function ResultsHeaderBase({ count, loading, degraded, onRefresh }: Props) {
  const title = useMemo(
    () => (loading ? "Extracting…" : "Extracted Events"),
    [loading]
  );

  const badge = useMemo(() => {
    if (loading)
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-400" />
          parsing…
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {count} found
      </span>
    );
  }, [loading, count]);

  return (
    <div className="chakra-petch-regular">
      {/* Top row */}
      <div className="flex flex-col gap-3 border-b border-zinc-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Title + subtitle */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <motion.h3
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="truncate text-lg font-semibold text-zinc-900"
            >
              {title}
            </motion.h3>
            {/* subtle live-indicator while loading */}
            {loading && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-500"
              />
            )}
          </div>
          <p className="mt-0.5 text-xs text-zinc-500">
            From backend response
          </p>
        </div>

        {/* Right: Count badge + optional refresh */}
        <div className="flex items-center gap-2">
          {badge}

          {onRefresh && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={onRefresh}
              disabled={!!loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50"
              aria-label="Refresh results"
              title="Refresh"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Degraded ribbon */}
      {degraded && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-5 mt-4 mb-2 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2 text-amber-800"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="text-sm">
            <span className="font-medium">Degraded mode.</span>{" "}
            Fallback used (LLM timeout or malformed JSON). You can still review and add events.
          </div>
        </motion.div>
      )}
    </div>
  );
}

const ResultsHeader = memo(ResultsHeaderBase);
export default ResultsHeader;