// src/lib/ics.ts
import type { EventLite } from "../types/extract";

const pad = (n: number) => String(n).padStart(2, "0");
const isoToUTC = (iso: string) => {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
};
const esc = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

export function buildICS(ev: EventLite) {
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@mee`;
  const dtStamp = isoToUTC(new Date().toISOString());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MEE//Extractor//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    ev.allDay
      ? `DTSTART;VALUE=DATE:${new Date(ev.start).toISOString().slice(0, 10).replace(/-/g, "")}`
      : `DTSTART:${isoToUTC(ev.start)}`,
    ...(ev.end
      ? [
          ev.allDay
            ? `DTEND;VALUE=DATE:${new Date(ev.end).toISOString().slice(0, 10).replace(/-/g, "")}`
            : `DTEND:${isoToUTC(ev.end)}`,
        ]
      : []),
    `SUMMARY:${esc(ev.title || "Untitled")}`,
    ...(ev.location ? [`LOCATION:${esc(ev.location)}`] : []),
    ...(ev.url ? [`URL:${esc(ev.url)}`] : []),
    ...(ev.description ? [`DESCRIPTION:${esc(ev.description)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ];
  return lines.join("\r\n");
}

export function downloadICS(ev: EventLite) {
  const ics = buildICS(ev);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const a = document.createElement("a");
  const date = ev.start?.slice(0, 10) ?? "event";
  const name = (ev.title || "event").replace(/[^a-z0-9-_]+/gi, "-").slice(0, 60);
  a.href = URL.createObjectURL(blob);
  a.download = `${date}-${name}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}