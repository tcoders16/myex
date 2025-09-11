// src/components/EventResults.tsx
import { AnimatePresence, motion } from "framer-motion";
import type { EventLite, ExtractionWarning } from "../../types/extract";
import ResultsHeader from "./ResultsHeader";
import WarningsBlock from "./WarningsBlock";
import LoadingList from "./LoadingList";
import EventList from "./EventList";

export default function EventResults({
  events,
  loading = false,
  degraded,
  warnings,
  onAddToCalendar,
  className,
}: {
  events: EventLite[];
  loading?: boolean;
  degraded?: boolean;
  warnings?: ExtractionWarning[];
  onAddToCalendar?: (ev: EventLite) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="relative rounded-3xl p-[1px] bg-[conic-gradient(at_0%_0%,#8b5cf6_0deg,#22d3ee_120deg,#10b981_240deg,#8b5cf6_360deg)]">
        <div className="rounded-[22px] bg-white shadow-xl">
          <ResultsHeader count={events.length} loading={loading} degraded={degraded} />
          <WarningsBlock warnings={warnings} />

          <div className="p-5">
            <AnimatePresence initial={false}>
              {loading ? (
                <LoadingList />
              ) : events.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="grid place-items-center rounded-2xl border border-dashed border-zinc-200 p-10 text-center"
                >
                  <div className="mb-3 text-3xl">📭</div>
                  <div className="text-zinc-800 font-medium">No events yet</div>
                  <div className="mt-1 text-sm text-zinc-500">
                    Click the floating <b>MEE</b> button in Gmail/Outlook to send an email for extraction.
                  </div>
                </motion.div>
              ) : (
                <EventList events={events} onAddToCalendar={onAddToCalendar} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}