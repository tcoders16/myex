// src/components/empty/WelcomeEmpty.tsx
import { motion } from "framer-motion";

export default function WelcomeEmpty() {
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


      </div>
    </motion.div>
  );
}