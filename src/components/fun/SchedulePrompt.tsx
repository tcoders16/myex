// src/components/fun/SchedulePrompt.tsx
import  { useEffect, useState } from "react";

type Props = {
  open: boolean;
  title: string;
  defaultStartISO: string;
  defaultEndISO: string;
  onConfirm: (args: { startISO: string; endISO: string }) => void | Promise<void>;
  onCancel: () => void;
};

export default function SchedulePrompt({
  open,
  title,
  defaultStartISO,
  defaultEndISO,
  onConfirm,
  onCancel,
}: Props) {
  const [startISO, setStartISO] = useState(defaultStartISO);
  const [endISO, setEndISO] = useState(defaultEndISO);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    if (open) {
      setStartISO(defaultStartISO);
      setEndISO(defaultEndISO);
      setErr("");
    }
  }, [open, defaultStartISO, defaultEndISO]);

  function submit() {
    const s = new Date(startISO);
    const e = new Date(endISO);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
      setErr("Please provide valid times.");
      return;
    }
    if (e <= s) {
      setErr("End must be after start.");
      return;
    }
    onConfirm({ startISO, endISO });
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="absolute inset-0 z-10 grid place-items-center bg-black/40"
    >
      <div className="w-[min(540px,92vw)] rounded-xl border border-[#1A3F1A] bg-[#0b210b] p-4 text-[#9FE870] shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
        <div className="text-sm font-semibold mb-2">Schedule: {title}</div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs text-[#8BE0A1]">
            Start
            <input
              data-id="start"
              type="datetime-local"
              value={toLocalInput(startISO)}
              onChange={(e) => setStartISO(fromLocalInput(e.target.value))}
              className="mt-1 w-full rounded-md border border-[#1A3F1A] bg-[#071607] px-2 py-1 text-[#9FE870] outline-none focus:ring-1 focus:ring-[#2ecc71]"
            />
          </label>

          <label className="block text-xs text-[#8BE0A1]">
            End
            <input
              type="datetime-local"
              value={toLocalInput(endISO)}
              onChange={(e) => setEndISO(fromLocalInput(e.target.value))}
              className="mt-1 w-full rounded-md border border-[#1A3F1A] bg-[#071607] px-2 py-1 text-[#9FE870] outline-none focus:ring-1 focus:ring-[#2ecc71]"
            />
          </label>
        </div>

        {err && <div className="mt-2 text-[11px] text-[#ffb4b4]">{err}</div>}

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-md border border-[#1A3F1A] bg-[#071607] px-3 py-1.5 text-xs text-[#8BE0A1] hover:bg-[#0e2a0e]"
          >
            Cancel (Esc)
          </button>
          <button
            onClick={submit}
            className="rounded-md border border-[#2ecc71] bg-[#144a14] px-3 py-1.5 text-xs text-[#9FE870] hover:bg-[#185d18]"
          >
            Add to Calendar (Enter)
          </button>
        </div>
      </div>
    </div>
  );
}

/* helpers: keep ISO <-> datetime-local stable */
function toLocalInput(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}
function fromLocalInput(local: string) {
  // treat as local and convert to ISO
  const d = new Date(local);
  return d.toISOString();
}