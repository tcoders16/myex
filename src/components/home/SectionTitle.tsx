export default function SectionTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-zinc-600">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
