// src/pages/sections/ResultsSection.tsx
import { memo } from "react";
import { motion } from "framer-motion";

import EventResults from "../../components/eventResult/EventResults";

// ---------- What this file does ----------
// Renders the “Extracted events” panel:
// - Shows a title + dynamic subtitle (count, loading, or empty state).
// - While extracting, displays a subtle skeleton.
// - When done, renders <EventResults> with the events + any warnings.
// - Small accessibility and animation niceties included.

// --------- Props (typed) ----------
type ResultsSectionProps = {
  events: any[];                 // array of event items to render
  loading?: boolean;             // true while the extractor is fetching
  busy?: boolean;                // extra flag while any other work is happening
  data?: { degraded?: boolean; warnings?: Array<{ code: string; message: string }> };
  className?: string;            // allow external layout styling
};

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.22 } },
};

function ResultsSection({
  events = [],
  loading = false,
  busy = false,
  data,
  className = "",
}: ResultsSectionProps) {
  const isWorking = loading || busy;

  // Compute subtitle once per render for clarity + perf
  // const subtitle = useMemo(() => {
  //   if (isWorking) return "Scanning…";
  //   if (events?.length) return `${events.length} found`;
  //   return "No events yet — paste something above or use the browser helper.";
  // }, [isWorking, events]);

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      aria-busy={isWorking}
      aria-live="polite"
      className={[
        "rounded-3xl border border-zinc-200 bg-white/70 p-4 shadow-sm backdrop-blur",
        "transition-shadow hover:shadow-md", // subtle hover lift
        className,
      ].join(" ")}
    >


      {/* Loading skeleton: lightweight and visually consistent */}
      {isWorking && (
        <ul className="mt-3 space-y-3" aria-label="Loading results">
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="h-[76px] animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/70"
            />
          ))}
        </ul>
      )}

      {/* Results (rendered only when not working) */}
      {!isWorking && (
        <div className="mt-2">
          <EventResults
            events={events}
            loading={false}
            degraded={data?.degraded}
          />
        </div>
      )}
    </motion.section>
  );
}

export default memo(ResultsSection);