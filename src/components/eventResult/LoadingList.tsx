// src/components/LoadingList.tsx
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};
const item = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22 } },
};

export default function LoadingList() {
  return (
    <motion.ul variants={container} initial="hidden" animate="show" className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.li key={i} variants={item} className="rounded-2xl border border-zinc-200 bg-white/70 p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-3 w-24 rounded bg-zinc-200" />
            <div className="h-5 w-2/3 rounded bg-zinc-200" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-4 w-full rounded bg-zinc-200" />
              <div className="h-4 w-full rounded bg-zinc-200" />
            </div>
            <div className="h-9 w-36 rounded-lg bg-zinc-900/10" />
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}