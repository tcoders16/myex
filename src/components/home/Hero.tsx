// src/components/home/Hero.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import StatusPill from "./StatusPill";
import SoftBadge from "./SoftBadge";
import ShieldIcon from "./ShieldIcon";
import ConnectGoogleCalendar from "../calendar/ConnectGoogleCalendar";

export default function Hero({ ok, loading }: { ok: boolean; loading: boolean }) {
  const [showConnect, setShowConnect] = useState(false);

  return (
    <header className="mx-auto max-w-6xl px-6 pt-10">
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/80 shadow-lg backdrop-blur"
      >
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Left side */}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
                Event Extractor
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                Capture events from any text source → Review →{" "}
                <span className="font-medium text-indigo-600">Add to Calendar</span>.
              </p>

              {/* CTA Button */}
              <div className="mt-5">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowConnect(true)}
                  className="relative inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-500 focus:outline-none"
                >
                  {/* sheen effect */}
                  <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                    <motion.span
                      initial={{ x: "-120%" }}
                      animate={{ x: "120%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 h-full w-1/3 -skew-x-12 bg-white/20"
                    />
                  </span>
                  Connect Google Calendar
                </motion.button>
              </div>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <StatusPill ok={ok} loading={loading} />
              <div className="flex gap-2">
                <SoftBadge>Local backend</SoftBadge>
                <SoftBadge>
                  <ShieldIcon /> Privacy-first
                </SoftBadge>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Popup */}
      {showConnect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md">
            <ConnectGoogleCalendar />
            <button
              onClick={() => setShowConnect(false)}
              className="absolute -top-3 -right-3 rounded-full bg-white p-1 shadow hover:bg-zinc-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </header>
  );
}