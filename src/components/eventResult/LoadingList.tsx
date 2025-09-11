// src/components/LoadingList.tsx
import { memo } from "react";
import { motion } from "framer-motion";

type Props = {
  /** number of skeleton items (default 3) */
  count?: number;
  /** compact list (smaller paddings/heights) */
  compact?: boolean;
};

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

function ShimmerBar({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded ${className}`}>
      <div className="h-full w-full bg-zinc-200/80 dark:bg-zinc-700/50" />
      {/* shimmer */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          className="h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20"
        />
      </div>
    </div>
  );
}

function LoadingCard({ compact = false }: { compact?: boolean }) {
  return (
    <motion.li
      variants={item}
      className={[
        "rounded-2xl border border-zinc-200/80 bg-white/70 p-4 shadow-sm backdrop-blur",
        "dark:border-zinc-800/70 dark:bg-zinc-900/50",
        compact ? "p-3" : "p-4",
      ].join(" ")}
      role="status"
      aria-busy="true"
    >
      <div className="space-y-3">
        {/* tiny metadata row */}
        <div className="flex items-center gap-2">
          <ShimmerBar className="h-3 w-24" />
          <ShimmerBar className="h-3 w-12" />
        </div>

        {/* title */}
        <ShimmerBar className={compact ? "h-4 w-2/3" : "h-5 w-3/4"} />

        {/* details grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ShimmerBar className={compact ? "h-3.5 w-full" : "h-4 w-full"} />
          <ShimmerBar className={compact ? "h-3.5 w-5/6" : "h-4 w-5/6"} />
        </div>

        {/* action button skeleton */}
        <div className="pt-1">
          <div
            className={[
              "inline-block rounded-xl",
              compact ? "h-8 w-32" : "h-9 w-36",
              "bg-zinc-900/10 dark:bg-white/10",
            ].join(" ")}
          />
        </div>
      </div>
      <span className="sr-only">Loading results…</span>
    </motion.li>
  );
}

function LoadingListBase({ count = 3, compact }: Props) {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} compact={compact} />
      ))}
    </motion.ul>
  );
}

const LoadingList = memo(LoadingListBase);
export default LoadingList;