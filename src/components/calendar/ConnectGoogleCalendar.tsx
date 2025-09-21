// src/components/calendar/ConnectGoogleCard.tsx
import { useMemo } from "react";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { Check, Loader2 } from "lucide-react";
 import { useGoogleCalendarAuthCtx as useGoogleCalendarAuth } from "../../context/GoogleCalendarAuthContext";

function GoogleLogo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
      alt="Google Logo"
      className={className}
    />
  );
}
export default function ConnectGoogleCalendar() {
  const { token, loading, error, ensureToken, revoke } = useGoogleCalendarAuth();

  const status: "idle" | "connecting" | "connected" = useMemo(() => {
    if (loading) return "connecting";
    if (token) return "connected";
    return "idle";
  }, [loading, token]);

  const isConnecting = status === "connecting";
  const isConnected = status === "connected";

  async function handleConnect() {
    try {
      await ensureToken(); // silent -> popup fallback
    } catch {}
  }
  async function handleDisconnect() {
    await revoke();
  }

  return (
    <section
      aria-labelledby="connect-calendar-title"
      className="relative w-full max-w-xl rounded-2xl border border-zinc-200 bg-white shadow-[0_8px_24px_rgba(16,24,40,0.06)]"
    >
      {/* Header band (subtle gradient) */}
      <div className="rounded-t-2xl bg-[linear-gradient(180deg,#F8FAFC_0%,#FFFFFF_100%)] px-5 py-4">
        <div className="flex items-center gap-3">
          {/* Constant outer circle */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm">
            {/* Inner fixed circle */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
              <GoogleLogo className="h-6 w-6" />
            </div>
          </div>

          <div className="min-w-0">
            <h2
              id="connect-calendar-title"
              className="truncate text-[17px] font-semibold text-zinc-900"
            >
              Connect Google Calendar
            </h2>
            <p className="text-xs text-zinc-600">
              Sign in once · Scope: calendar.events
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-5 pt-4">
        {/* Error (if any) */}
        {error && (
          <div
            role="alert"
            className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <StatusBadge status={status} />

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={isConnected ? handleDisconnect : handleConnect}
            disabled={isConnecting}
            className={[
              "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              isConnected
                ? "bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:ring-emerald-600"
                : "bg-zinc-900 text-white hover:bg-zinc-800 focus-visible:ring-zinc-900",
              isConnecting && "opacity-90 cursor-not-allowed",
            ].join(" ")}
            aria-live="polite"
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Connecting…
              </>
            ) : isConnected ? (
              <>
                <Check className="h-4 w-4" aria-hidden />
                Disconnect
              </>
            ) : (
              <>
                <FaGoogle className="h-4 w-4" aria-hidden />
                Connect
              </>
            )}
          </motion.button>
        </div>

        {/* Informational footer */}

      </div>
    </section>
  );
}

/* ---------------------- Subcomponents ---------------------- */

function StatusBadge({ status }: { status: "idle" | "connecting" | "connected" }) {
  if (status === "connecting") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        Authorizing…
      </span>
    );
  }
  if (status === "connected") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
        <Check className="h-3.5 w-3.5" aria-hidden />
        Google connected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700">
      Ready to connect
    </span>
  );
}