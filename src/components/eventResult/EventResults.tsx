// src/components/EventResults.tsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { EventLite, ExtractionWarning } from "../../types/extract";
import ResultsHeader from "./ResultsHeader";
import WarningsBlock from "./WarningsBlock";
import LoadingList from "./LoadingList";
import EventList from "./EventList";
import { Filter, ListTree, ChevronDown } from "lucide-react";

type Props = {
  events: EventLite[];
  loading?: boolean;
  degraded?: boolean;
  warnings?: ExtractionWarning[];
  onAddToCalendar?: (ev: EventLite) => void;
  className?: string;
};

export default function EventResults({
  events,
  loading = false,
  degraded,
  warnings,
  onAddToCalendar,
  className,
}: Props) {
  const [showWarnings, setShowWarnings] = useState(true);
  const [dense, setDense] = useState(false);

  return (
    <section aria-label="Extracted events" className={["chakra-petch-regular", className].filter(Boolean).join(" ")}>
      {/* Header */}
      <ResultsHeader count={events.length} loading={loading} degraded={degraded} />

      {/* Local toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-3">
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1">
            <Filter className="h-3.5 w-3.5 text-zinc-400" />
            Quick view
          </span>
          <button
            type="button"
            onClick={() => setDense((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 transition ${
              dense ? "border-zinc-200 bg-zinc-50 text-zinc-800"
                    : "border-zinc-200 bg-white text-zinc-600 hover:text-zinc-800"
            }`}
            title="Toggle dense layout"
          >
            <ListTree className="h-3.5 w-3.5" />
            {dense ? "Comfort" : "Dense"}
          </button>
        </div>

        {warnings && warnings.length > 0 && (
          <button
            type="button"
            onClick={() => setShowWarnings((v) => !v)}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
            aria-expanded={showWarnings}
          >
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showWarnings ? "rotate-180" : ""}`} />
            {showWarnings ? "Hide" : "Show"} warnings
          </button>
        )}
      </div>

      {/* Warnings */}
      <AnimatePresence initial={false}>
        {showWarnings && warnings && warnings.length > 0 && (
          <motion.div
            key="warnings"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="px-5 pt-3">
              <WarningsBlock warnings={warnings} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Body */}
      <div className={dense ? "p-4" : "p-5"}>
        <AnimatePresence initial={false} mode="popLayout">
          {loading ? (
            <LoadingList />
          ) : events.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="grid place-items-center rounded-2xl border border-dashed border-zinc-200 p-10 text-center"
              role="status"
              aria-live="polite"
            >
              <div className="mb-3 text-3xl">📭</div>
              <div className="font-medium text-zinc-800">No events yet</div>
              <div className="mt-1 text-sm text-zinc-500">
                Click the floating <b>MEE</b> button in Gmail/Outlook or use <i>Paste → Extract</i>.
              </div>
            </motion.div>
          ) : (
            <EventList key="list" events={events} onAddToCalendar={onAddToCalendar} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}