// src/utils/eventFrom.ts
// Shapes your EventLite into a Google Calendar "event" payload.

export type EventLite = {
  title?: string;
  description?: string;
  location?: string;
  start?: string;   // ISO date-time or YYYY-MM-DD
  end?: string;     // ISO date-time or YYYY-MM-DD (optional)
  timezone?: string;
};



type GoogleTimed = {
  summary?: string;
  description?: string;
  location?: string;
  start: { dateTime: string; timeZone?: string };
  end:   { dateTime: string; timeZone?: string };
};




type GoogleAllDay = {
  summary?: string;
  description?: string;
  location?: string;
  start: { date: string };
  end:   { date: string }; // end is exclusive
};




export type GoogleEventPayload = GoogleTimed | GoogleAllDay;


// Simple ISO date-time parser (accepts "2024-08-30" as well)
export function parseISOLoose(s: string): Date | null {
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

// Clamp to positive range

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

const addMinutes = (iso: string, mins: number) =>
  new Date(new Date(iso).getTime() + mins * 60_000).toISOString();

const nextDay = (yyyyMmDd: string) => {
  // Treat as UTC midnight to avoid TZ drift, then +1 day
  const d = new Date(`${yyyyMmDd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

export function eventFrom(ev: EventLite, defaultMinutes = 30): GoogleEventPayload {
  if (!ev.start) {
    throw new Error("Event is missing start date/time");
  }

  const summary = (ev.title || "Untitled").trim();
  const description = (ev.description || "").trim();
  const location = (ev.location || "").trim();

  // All-day (YYYY-MM-DD)
  if (DATE_ONLY_RE.test(ev.start)) {
    const startDate = ev.start;
    // If end provided as date-only, keep it; else make it same day
    const endDate = ev.end && DATE_ONLY_RE.test(ev.end) ? ev.end : startDate;

    return {
      summary,
      description,
      location,
      start: { date: startDate },
      end:   { date: nextDay(endDate) }, // Google expects exclusive end
    };
  }

  // Timed event (dateTime)
  const tz = ev.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const startDT = ev.start;
  const endDT = ev.end && !DATE_ONLY_RE.test(ev.end)
    ? ev.end
    : addMinutes(startDT, defaultMinutes);

  return {
    summary,
    description,
    location,
    start: { dateTime: startDT, timeZone: tz },
    end:   { dateTime: endDT,   timeZone: tz },
  };
}