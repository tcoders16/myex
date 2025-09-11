// src/components/eventResult/EventCard.tsx
import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Timer, AlertTriangle } from "lucide-react";
import type { EventLite } from "../../types/extract";
import SourceBadge from "./atoms/SourceBadge";
import ConfidenceMeter from "./atoms/ConfidenceMeter";

import { useGoogleCalendarAuthCtx as useGoogleCalendarAuth } from "../../context/GoogleCalendarAuthContext";
import { eventFrom } from "../../utils/eventFrom";
import { createCalendarEvent } from "../../api/google";
import AddEventButton from "./buttons/AddEventButton";

export type EventCardProps = {
  ev: EventLite;
  onAddToCalendar?: (ev: EventLite) => Promise<void> | void;
  calendarId?: string; // defaults to "primary"
  /** Optional: let parent open your Connect modal/sheet */
  onRequestConnect?: () => void;
};

/* ---------- tiny helpers ---------- */
function parseISOLoose(iso?: string): Date | null {
  if (!iso || typeof iso !== "string") return null;
  const d = new Date(iso);
  if (!Number.isNaN(d.getTime())) return d;
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const d2 = new Date(`${iso}T00:00:00`);
    return Number.isNaN(d2.getTime()) ? null : d2;
  }
  return null;
}

const fmtDate = (iso?: string, tz?: string) => {
  const d = parseISOLoose(iso);
  if (!d) return "No date";
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: tz,
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  }
};

const fmtTime = (iso?: string, tz?: string) => {
  const d = parseISOLoose(iso);
  if (!d) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
    }).format(d);
  } catch {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(d);
  }
};

const durationMin = (a?: string, b?: string) => {
  const da = parseISOLoose(a);
  const db = parseISOLoose(b);
  if (!da || !db) return undefined;
  const ms = db.getTime() - da.getTime();
  return ms >= 0 ? Math.round(ms / 60000) : undefined;
};

/* ---------- component ---------- */
export default function EventCard({
  ev,
  onAddToCalendar,
  calendarId = "primary",
  onRequestConnect,
}: EventCardProps) {
  const [adding, setAdding] = useState(false);
  const [result, setResult] = useState<"idle" | "added" | "error">("idle");

  // Shared auth context (single source of truth)
  const { token, loading, ensureToken } = useGoogleCalendarAuth();
  const connected = Boolean(token);
  const connecting = loading;

  const mins = useMemo(
    () => (ev.start && ev.end ? durationMin(ev.start, ev.end) : undefined),
    [ev.start, ev.end]
  );
  const startValid = useMemo(() => !!parseISOLoose(ev.start), [ev.start]);

  const handleAdd = useCallback(async () => {
    if (!parseISOLoose(ev.start)) {
      alert("This event is missing a valid start date/time.");
      return;
    }

    try {
      setAdding(true);
      setResult("idle");

      // 1) Ensure a fresh token right before add (silent → popup if needed)
      const t = await ensureToken();
      if (!t) throw new Error("Google Calendar not connected");

      // 2) Parent override flow (e.g., custom modal)
      if (onAddToCalendar) {
        await onAddToCalendar(ev);
        setResult("added");
        setTimeout(() => setResult("idle"), 2500);
        return;
      }

      // 3) Confirm (optional)
      const whenStr = `${fmtDate(ev.start, ev.timezone)} • ${fmtTime(
        ev.start,
        ev.timezone
      )}${ev.timezone ? ` (${ev.timezone})` : ""}`;
      const ok = window.confirm(
        `Add “${ev.title || "Untitled"}” on ${whenStr} to your Google Calendar?`
      );
      if (!ok) return;

      // 4) Build Google payload
      const googleEvent = eventFrom({
        title: ev.title,
        description: ev.description,
        location: ev.location,
        start: ev.start,
        end: ev.end,
        timezone: ev.timezone,
      });

      // 5) Call backend helper (which posts to Google). Retry once if token expired.
      let res = await createCalendarEvent(t, googleEvent, calendarId);
      if (!res.ok && res.error === "TOKEN_EXPIRED") {
        const fresh = await ensureToken();
        res = await createCalendarEvent(fresh, googleEvent, calendarId);
      }

      if (!res.ok) throw new Error(res.error || "Could not add to Google Calendar");

      // 6) Success UI → green button; optional: open in Google Calendar
      setResult("added");
      setTimeout(() => setResult("idle"), 2500);
      if (res.htmlLink) window.open(res.htmlLink, "_blank");
    } catch (err: any) {
      console.error(err);
      setResult("error");
      setTimeout(() => setResult("idle"), 2500);
      alert(err?.message || "Could not add to Google Calendar.");
    } finally {
      setAdding(false);
    }
  }, [ev, onAddToCalendar, calendarId, ensureToken]);

  // When not connected, clicking the button should open your connect UI (modal/sheet).
  const handleConnect = useCallback(async () => {
    if (onRequestConnect) {
      await onRequestConnect();
      return;
    }
    // Fallback: try interactive auth directly.
    await ensureToken();
  }, [onRequestConnect, ensureToken]);

  return (
    <motion.li
      variants={item}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 p-4 transition-shadow hover:shadow-lg"
    >
      {/* soft hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute -inset-20 bg-[radial-gradient(120px_80px_at_var(--x)_var(--y),rgba(99,102,241,0.12),transparent)]" />
      </div>

      <div
        className="flex items-start justify-between gap-4"
        onMouseMove={(e) => {
          const el = e.currentTarget.parentElement as HTMLElement;
          const rect = el.getBoundingClientRect();
          el.style.setProperty("--x", `${e.clientX - rect.left}px`);
          el.style.setProperty("--y", `${e.clientY - rect.top}px`);
        }}
      >
        {/* Left: details */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide">
            <SourceBadge source={ev.source} />
            {typeof ev.confidence === "number" && (
              <ConfidenceMeter value={Math.max(0, Math.min(1, ev.confidence))} />
            )}
            {!startValid && (
              <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                <AlertTriangle className="h-3 w-3" />
                Start time needed
              </span>
            )}
          </div>

          <h4 className="mt-1 truncate text-base font-semibold text-zinc-900">
            {ev.title || "Untitled"}
          </h4>

          <div className="mt-2 grid grid-cols-1 gap-1 text-sm text-zinc-700 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-zinc-400" />
              <span className="truncate">
                {fmtDate(ev.start, ev.timezone)} • {fmtTime(ev.start, ev.timezone)}
                {ev.timezone ? ` (${ev.timezone})` : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 shrink-0 text-zinc-400" />
              <span className="truncate">
                {mins !== undefined ? `${mins} min` : ev.end ? "ends set" : "no end"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: action — dumb button with explicit state/handlers */}
        <AddEventButton
          adding={adding}
          disabled={adding || !startValid}
          connected={connected}
          connecting={connecting}
          onConnect={handleConnect}
          onAdd={handleAdd}
          result={result}
          titleWhenReady={
            !startValid ? "Cannot add: start time missing/invalid" : "Add to Google Calendar"
          }
        />
      </div>
    </motion.li>
  );
}

/* enter/exit variants */
const item = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.15 } },
};