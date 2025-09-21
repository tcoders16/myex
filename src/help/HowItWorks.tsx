// src/components/help/HowItWorks.tsx
import { motion } from "framer-motion";
import {
  PlugZap,
  FileText,
  CalendarCheck,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Mail,
  FileType2,
  Blocks,
} from "lucide-react";

type Props = { backendOk?: boolean };

export default function HowItWorks({ backendOk }: Props) {
  return (
    <section className="chakra-petch-regular mx-auto max-w-6xl px-5 pt-8 pb-6">
      {/* Shell */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/80 shadow-[0_18px_60px_rgba(0,0,0,0.07)] backdrop-blur"
      >
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-28 -left-28 h-72 w-72 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-28 h-72 w-72 rounded-full blur-3xl" />

        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/80 p-5 md:p-6">
          <div className="min-w-0">
            <h2 className="truncate text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900">
              How it works
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-zinc-600">
              Extract events from emails today — and soon from Google Docs, Word, Notion, and
              other surfaces — then add them to your calendar with one click.
            </p>
          </div>

          <StatusChip backendOk={backendOk} />
        </div>

        {/* Steps timeline */}
        <div className="relative grid gap-4 p-5 md:p-6">
          <Timeline>
            {/* Email step */}
            <Step
              icon={<Mail className="h-5 w-5" />}
              title="Open your email"
              body={
                <>
                  Works right now with <b>Gmail</b> and <b>Outlook</b>. Just open a message
                  that includes dates, times, or schedules.
                </>
              }
              accent="from-indigo-500/20 to-sky-500/20"
            />

            {/* Local extractor */}
            <Step
              icon={<PlugZap className="h-5 w-5" />}
              title="Send to local extractor"
              body={
                <>
                  Click the floating <b>Event Extractor</b> button. Your visible text is sent
                  to your <span className="font-medium">local backend</span> for private,
                  instant parsing.
                </>
              }
              accent="from-emerald-500/20 to-cyan-500/20"
            />

          {/* Calendar add */}
          <Step
            icon={
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
                alt="Google Calendar"
                className="h-2 w-2 md:h-7 md:w-10"
              />
            }
            title="Review → Add to Google Calendar"
            body={
              <>
                Confirm titles, times, and locations. Then hit{" "}
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-2 py-0.5 text-[11px] font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
                    alt="Google Calendar"
                    className="h-4 w-4"
                  />
                  <span>Add to Google Calendar</span>
                </button>{" "}
                to instantly create events.
              </>
            }
            accent="from-fuchsia-500/20 to-rose-500/20"
          />

            {/* Future integrations */}
            <Step
              icon={<FileType2 className="h-5 w-5" />}
              title="Google Docs & Word (coming soon)"
              body={
                <>
                  Select meeting notes or timelines directly inside <b>Docs</b> or{" "}
                  <b>Word Online</b>, then extract events with one click.
                </>
              }
              accent="from-amber-500/20 to-orange-500/20"
            />

            <Step
              icon={<Blocks className="h-5 w-5" />}
              title="Notion & beyond (coming soon)"
              body={
                <>
                  Capture deadlines and schedules from <b>Notion pages</b> or other tools —
                  right from your Chrome sidebar.
                </>
              }
              accent="from-purple-500/20 to-pink-500/20"
            />
          </Timeline>
        </div>

        {/* Guarantees / CTA strip */}
        <div className="border-t border-zinc-200/80 bg-white/70">
          <div className="grid gap-3 p-5 md:grid-cols-3 md:gap-4 md:p-6">
            <Pill
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Privacy-first"
              desc="All extraction runs locally — your text never leaves your machine."
            />
            <Pill
              icon={<Sparkles className="h-4 w-4" />}
              label="High-precision"
              desc="Smart parsing handles ranges, timezones, and natural language."
            />
            <Pill
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="One-click adds"
              desc="Connect Google Calendar once, then add events instantly."
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/80 p-5 md:p-6">
            <Tip />
            <CTA />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* -------------------- Bits & Pieces -------------------- */

function StatusChip({ backendOk }: { backendOk?: boolean }) {
  const ok = !!backendOk;
  return (
    <span
      title={ok ? "Local backend reachable" : "Waiting for backend"}
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1",
        ok
          ? "bg-emerald-100 text-emerald-800 ring-emerald-200"
          : "bg-amber-100 text-amber-900 ring-amber-200",
      ].join(" ")}
    >
      <PlugZap className="h-3.5 w-3.5" />
      {ok ? "Backend connected" : "Backend pending"}
    </span>
  );
}

function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* vertical line */}
      <div className="pointer-events-none absolute left-5 top-3 bottom-3 w-px bg-gradient-to-b from-transparent via-zinc-200 to-transparent md:left-6" />
      <ol className="grid gap-3">{children}</ol>
    </div>
  );
}

function Step({
  icon,
  title,
  body,
  accent = "from-indigo-500/20 to-emerald-500/20",
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
  accent?: string;
}) {
  const isComingSoon = title.toLowerCase().includes("coming soon");

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
      transition={{ duration: 0.22 }}
      className={`group relative grid grid-cols-[40px_1fr] items-start gap-3 md:grid-cols-[48px_1fr] ${
        isComingSoon ? "opacity-95" : ""
      }`}
    >
      {/* dot */}
      <div className="relative mt-1 flex h-10 w-10 items-center justify-center md:h-12 md:w-12">
        <div
          className={[
            "absolute inset-0 rounded-full bg-gradient-to-br opacity-80 blur-[6px]",
            accent,
          ].join(" ")}
        />
        <div className="relative grid h-10 w-10 place-items-center rounded-full border border-zinc-200 bg-white shadow-sm md:h-12 md:w-12">
          <span className="text-zinc-700">{icon}</span>
        </div>
      </div>

      {/* card */}
      <div
        className={`overflow-hidden rounded-2xl border bg-white/85 p-4 shadow-sm transition group-hover:shadow-md ${
          isComingSoon ? "border-amber-400 bg-amber-50/95" : "border-zinc-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-zinc-900">{title}</div>
          {isComingSoon && (
            <span className="rounded-md bg-amber-400/20 px-2 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-amber-300">
              Coming soon
            </span>
          )}
        </div>
        <p className="mt-1 text-sm leading-relaxed text-zinc-700">{body}</p>
      </div>
    </motion.li>
  );
}
function Pill({
  icon,
  label,
  desc,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm">
      <div className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-200 bg-zinc-50">
        <span className="text-zinc-700">{icon}</span>
      </div>
      <div>
        <div className="text-sm font-semibold text-zinc-900">{label}</div>
        <div className="text-sm text-zinc-600">{desc}</div>
      </div>
    </div>
  );
}

function Tip() {
  return (
    <p className="text-xs text-zinc-500">
      Tip: Features are rolling out gradually. Docs, Word, and Notion support will be added soon!
    </p>
  );
}

function CTA() {
  return (
    <button
      type="button"
      disabled
      className="group inline-flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-50 px-3.5 py-2 text-sm font-medium text-amber-700 shadow-sm cursor-not-allowed"
      aria-label="Coming soon"
      title="Coming soon"
    >
      Try Docs → Extract
      <span className="ml-1 rounded-md bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-300">
        Coming soon
      </span>
    </button>
  );
}