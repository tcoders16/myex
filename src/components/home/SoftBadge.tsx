export default function SoftBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-200 bg-white/70 px-2.5 py-1 text-xs text-zinc-700 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}
