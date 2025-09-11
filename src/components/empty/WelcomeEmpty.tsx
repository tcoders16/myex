// src/components/empty/WelcomeEmpty.tsx
import { motion } from "framer-motion";
import { CalendarPlus, PlugZap } from "lucide-react";

export default function WelcomeEmpty({
  onConnect,
  onScrollToPaste,
}: {
  onConnect?: () => void;
  onScrollToPaste?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid place-items-center rounded-3xl border border-zinc-200 bg-white/80 p-8 text-center"
    >
      <div className="text-2xl">✨</div>
      <h3 className="mt-2 text-lg font-semibold text-zinc-900">Welcome to Event Extractor</h3>
      <p className="mt-1 text-sm text-zinc-600">
        Connect Google Calendar once, then paste text or use the helper button to extract events.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={onConnect}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          <PlugZap className="h-4 w-4" />
          Connect Calendar
        </button>
        <button
          onClick={onScrollToPaste}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-900 hover:shadow-sm"
        >
          <CalendarPlus className="h-4 w-4" />
          Try Paste → Extract
        </button>
      </div>
    </motion.div>
  );
}