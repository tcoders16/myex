import { motion } from "framer-motion";

import StatusPill from "./StatusPill";
import SoftBadge from "./SoftBadge";
import ShieldIcon from "./ShieldIcon";

export default function Hero({ ok, loading }: { ok: boolean; loading: boolean }) {
  return (
    <header className="mx-auto max-w-6xl px-6 pt-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              ex <span className="text-zinc-400">·</span> Multi-surface Extractor
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-zinc-600">
              Capture events and actions from any source of text.
              Review them, adjust as needed, then click <br />
              <span className="mx-1 rounded-md border border-zinc-300 bg-white/80 px-1.5 py-0.5 text-[11px] text-zinc-800">
                Add to Calendar
              </span> — you stay in control.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill ok={ok} loading={loading} />
            <SoftBadge>Local backend</SoftBadge>
            <SoftBadge>
              <ShieldIcon /> Privacy-first
            </SoftBadge>
          </div>
        </div>
      </motion.div>
    </header>
  );
}