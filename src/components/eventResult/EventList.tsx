// src/components/eventResult/EventList.tsx
import { motion, type Variants, type Transition } from "framer-motion";
import type { EventLite } from "../../types/extract";
import EventCard from "./EventCard";

// Extend Transition so TS accepts staggerChildren/delayChildren
type StaggerTransition = Transition & {
  staggerChildren?: number;
  delayChildren?: number;
};

/** Parent list animation:
 * - hidden: start faded + a bit lower
 * - show: fade/slide up
 * - children: cascade in (staggered)
 */
const container: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
      staggerChildren: 0.08,
      delayChildren: 0.05,
    } as StaggerTransition, // <-- key bit for TS
  },
};

type Props = {
  events: EventLite[];
  onAddToCalendar?: (ev: EventLite) => void;
};

/** EventList
 * Renders an animated <ul> and one EventCard per event.
 */
export default function EventList({ events, onAddToCalendar }: Props) {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      {events.map((ev, i) => (
        <EventCard
          key={`${ev.title}-${ev.start}-${i}`}
          ev={ev}
          onAddToCalendar={onAddToCalendar}
        />
      ))}
    </motion.ul>
  );
}