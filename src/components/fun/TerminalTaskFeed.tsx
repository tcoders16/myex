// src/components/fun/TerminalTaskFeed.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import TerminalWindow from "./TerminalWindow";
import SchedulePrompt from "./SchedulePrompt";

/** Props:
 *  - onAddCalendar({ title, start, end }) is your only integration point.
 *    Hook it to your existing Google Calendar flow.
 */
type Props = {
  maxLines?: number;
  pollMs?: number;
  typingMs?: number;
  onAddCalendar?: (args: { title: string; start: string; end: string }) => void | Promise<void>;
};

type GHEvent = {
  id: string;
  type: string;
  repo: { name: string };
  actor: { login: string };
  created_at: string;
  payload?: any;
};

type Suggestion = {
  id: string;
  label: string;  // shown in list
  title: string;  // used for calendar title
  source: "bored" | "github";
};

export default function TerminalTaskFeed({
  maxLines = 6,
  pollMs = 60_000,
  typingMs = 18,
  onAddCalendar,
}: Props) {
  const [ghLines, setGhLines] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [typed, setTyped] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error" | "ratelimited">("idle");
  const [errMsg, setErrMsg] = useState("");

  const [selectedIdx, setSelectedIdx] = useState<number>(-1);
  const [scheduleFor, setScheduleFor] = useState<Suggestion | null>(null);
  const [defaults, setDefaults] = useState<{ startISO: string; endISO: string } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  /* ------------ Fetch GitHub public events ------------ */
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    async function fetchEvents() {
      setStatus((s) => (s === "ok" ? "ok" : "loading"));
      try {
        const res = await fetch("https://api.github.com/events", {
          signal: controller.signal,
          headers: { Accept: "application/vnd.github+json" },
        });
        if (res.status === 403) {
          if (!alive) return;
          setStatus("ratelimited");
          setErrMsg("GitHub API rate limit (~60/hr) reached. Retrying soon.");
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json: GHEvent[] = await res.json();
        if (!alive) return;

        const cooked = json.slice(0, maxLines).map(formatEventLine).filter(Boolean) as string[];
        setGhLines(cooked.length ? cooked : ["No recent activity found."]);
        setStatus("ok");
        setErrMsg("");
      } catch (e: any) {
        if (!alive) return;
        if (e?.name === "AbortError") return;
        setStatus("error");
        setErrMsg(e?.message || "Network error");
      }
    }

    fetchEvents();
    const id = setInterval(fetchEvents, pollMs);
    return () => {
      alive = false;
      controller.abort();
      clearInterval(id);
    };
  }, [maxLines, pollMs]);

  /* ------------ Fetch Bored API suggestions ------------ */
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    async function pullBored() {
      try {
        const res = await fetch("https://www.boredapi.com/api/activity", { signal: controller.signal });
        if (!res.ok) throw new Error(`Bored API HTTP ${res.status}`);
        const json = await res.json();
        if (!alive) return;

        const act = String(json?.activity || "").trim();
        if (!act) return;

        const sug: Suggestion = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          label: `Task: ${capitalize(act)} today`,
          title: capitalize(act),
          source: "bored",
        };

        setSuggestions((prev) => {
          const next = [sug, ...prev.filter((p) => p.label !== sug.label)];
          return next.slice(0, 5);
        });
      } catch {
        /* ignore; try again later */
      }
    }

    pullBored();
    const id = setInterval(pullBored, Math.max(45_000, pollMs));
    return () => {
      alive = false;
      controller.abort();
      clearInterval(id);
    };
  }, [pollMs]);

  /* ------------ Build typewriter script (GitHub feed only) ------------ */
  const script = useMemo(() => {
    const header = "connecting to github… ok\nscanning public events…\n\n";
    const ghBody = ghLines.map((l) => `• ${l}`).join("\n");
    return header + ghBody;
  }, [ghLines]);

  /* ------------ Typewriter effect ------------ */
  useEffect(() => {
    let alive = true;
    setTyped("");
    const speed = status === "error" || status === "ratelimited" ? Math.max(typingMs / 3, 8) : typingMs;

    const loop = setInterval(() => {
      if (!alive) return;
      setTyped((prev) => {
        if (prev.length >= script.length) {
          clearInterval(loop);
          return prev;
        }
        return script.slice(0, prev.length + 1);
      });
    }, speed);

    return () => {
      alive = false;
      clearInterval(loop);
    };
  }, [script, typingMs, status]);

  /* ------------ Keyboard: TAB / ENTER / ESC ------------ */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // ignore while modal open
      if (scheduleFor) return;

      if (e.key === "Tab") {
        e.preventDefault();
        if (suggestions.length === 0) return;
        setSelectedIdx((idx) => (idx + 1) % suggestions.length);
      } else if (e.key === "Enter") {
        if (selectedIdx >= 0 && selectedIdx < suggestions.length) {
          const pick = suggestions[selectedIdx];
          openSchedule(pick);
        }
      } else if (e.key === "Escape") {
        setSelectedIdx(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [suggestions, selectedIdx, scheduleFor]);

  function openSchedule(s: Suggestion) {
    setScheduleFor(s);
    const start = new Date();
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    setDefaults({ startISO: start.toISOString(), endISO: end.toISOString() });
    // focus in modal handled inside SchedulePrompt
  }

  async function handleConfirm({ startISO, endISO }: { startISO: string; endISO: string }) {
    if (!scheduleFor) return;
    try {
      await onAddCalendar?.({ title: scheduleFor.title, start: startISO, end: endISO });
      // brief success indicator: replace first line with “scheduled”
      setSuggestions((prev) =>
        prev.map((s, i) => (i === selectedIdx ? { ...s, label: `✓ Scheduled: ${s.title}` } : s))
      );
      setSelectedIdx(-1);
    } finally {
      setScheduleFor(null);
    }
  }

  const statusText =
    status === "loading" ? "fetching…" :
    status === "ok" ? "online" :
    status === "ratelimited" ? "rate-limited" :
    status === "error" ? "error" : "idle";

  return (
    <div ref={containerRef} className="w-full px-0">
      <TerminalWindow title="github feed" status={statusText}>
        {/* typed feed */}
        <pre
          className={[
            "m-0 whitespace-pre-wrap break-words",
            "font-mono text-[12.5px] leading-relaxed",
            "text-[#9FE870]",
          ].join(" ")}
          aria-live="polite"
        >
          {typed}
          <span className="inline-block h-4 w-2 align-[-2px] bg-[#9FE870] ml-1 animate-pulse" />
        </pre>

        {/* interactive suggestions (not part of typewriter for responsiveness) */}
        <div className="mt-4 border-t border-[#194019] pt-3">
          <div className="mb-1 text-[11px] uppercase tracking-wider text-[#6df0b0]">
            interactive tasks (Tab → select • Enter → schedule)
          </div>

          {suggestions.length === 0 ? (
            <div className="text-[#8BE0A1] text-[12px]">Waiting for ideas…</div>
          ) : (
            <ul className="space-y-1">
              {suggestions.map((s, i) => {
                const active = i === selectedIdx;
                return (
                  <li
                    key={s.id}
                    className={[
                      "flex items-center gap-2 rounded-md px-2 py-1 font-mono text-[12.5px]",
                      active ? "bg-[#0f2a0f] text-[#C7FFB0]" : "text-[#9FE870]",
                    ].join(" ")}
                  >
                    <span className="inline-block w-4">{active ? "▶" : "•"}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIdx(i);
                        openSchedule(s);
                      }}
                      className="text-left hover:underline"
                    >
                      {s.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-3 text-[11px] text-[#8BE0A1]">
            Press <span className="px-1 rounded bg-[#0f2a0f]">Tab</span> to highlight,{" "}
            <span className="px-1 rounded bg-[#0f2a0f]">Enter</span> to schedule,{" "}
            <span className="px-1 rounded bg-[#0f2a0f]">Esc</span> to clear.
          </div>
        </div>

        {/* inline scheduler */}
        <SchedulePrompt
          open={Boolean(scheduleFor)}
          title={scheduleFor?.title || ""}
          defaultStartISO={defaults?.startISO || new Date().toISOString()}
          defaultEndISO={defaults?.endISO || new Date(Date.now() + 3600_000).toISOString()}
          onConfirm={handleConfirm}
          onCancel={() => setScheduleFor(null)}
        />
      </TerminalWindow>

      {/* footer for errors */}
      {(status === "error" || status === "ratelimited") && (
        <div className="mx-auto mt-2 w-full max-w-3xl rounded-xl border border-[#1A3F1A] bg-[#0b210b] px-3 py-2 text-[11px] text-[#8BE0A1]">
          {errMsg}
        </div>
      )}
    </div>
  );
}

/* ---------------- helpers ---------------- */
function formatEventLine(ev: GHEvent): string {
  const t = ev.type || "Event";
  const repo = ev.repo?.name ?? "unknown/repo";
  const user = ev.actor?.login ?? "someone";
  const when = timeAgo(ev.created_at);

  switch (t) {
    case "PushEvent": {
      const commits = ev.payload?.commits?.length ?? 1;
      return `${user} pushed ${commits} commit${commits === 1 ? "" : "s"} to ${repo} · ${when}`;
    }
    case "PullRequestEvent": {
      const action = ev.payload?.action ?? "updated";
      const num = ev.payload?.number ? `#${ev.payload.number}` : "";
      return `${user} ${action} PR ${num} on ${repo} · ${when}`;
    }
    case "IssuesEvent": {
      const action = ev.payload?.action ?? "updated";
      const num = ev.payload?.issue?.number ? `#${ev.payload.issue.number}` : "";
      return `${user} ${action} issue ${num} on ${repo} · ${when}`;
    }
    case "CreateEvent": {
      const ref_type = ev.payload?.ref_type ?? "ref";
      const ref = ev.payload?.ref ? ` ${ev.payload.ref}` : "";
      return `${user} created ${ref_type}${ref} in ${repo} · ${when}`;
    }
    case "DeleteEvent": {
      const ref_type = ev.payload?.ref_type ?? "ref";
      const ref = ev.payload?.ref ? ` ${ev.payload.ref}` : "";
      return `${user} deleted ${ref_type}${ref} in ${repo} · ${when}`;
    }
    case "ForkEvent":
      return `${user} forked ${repo} · ${when}`;
    case "WatchEvent":
      return `${user} starred ${repo} · ${when}`;
    default:
      return `${user} did ${t.replace(/Event$/, "")} on ${repo} · ${when}`;
  }
}

function timeAgo(iso?: string): string {
  if (!iso) return "just now";
  const d = new Date(iso);
  const diff = Math.max(0, Date.now() - d.getTime());
  const s = Math.round(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.round(h / 24);
  return `${days}d ago`;
}

function capitalize(s: string) {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}