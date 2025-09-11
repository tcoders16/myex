// src/components/atoms/ConfidenceMeter.tsx
export default function ConfidenceMeter({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <span className="inline-flex items-center gap-2 text-zinc-500">
      conf {pct}%
      <span className="relative inline-block h-1.5 w-16 overflow-hidden rounded bg-zinc-200">
        <span
          className="absolute left-0 top-0 h-full rounded bg-gradient-to-r from-indigo-500 to-sky-400"
          style={{ width: `${pct}%` }}
        />
      </span>
    </span>
  );
}