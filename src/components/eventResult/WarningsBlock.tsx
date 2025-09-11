// src/components/WarningsBlock.tsx
import type { ExtractionWarning } from "../../types/extract";

export default function WarningsBlock({ warnings }: { warnings?: ExtractionWarning[] }) {
  if (!warnings?.length) return null;

  return (
    <div
      className="mx-5 my-4 rounded-2xl border border-amber-400 bg-amber-100 px-4 py-3"
      role="status"
      aria-live="polite"
    >
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-900">
        <span className="text-base leading-none">⚠️</span>
        <span>Warning:</span>
      </div>

      <ul className="space-y-1">
        {warnings.map((w, idx) => (
          <li key={`${w.code}-${idx}`} className="text-sm text-amber-900">
            <span className="mr-2 inline-block rounded-md bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-900">
              {w.code}
            </span>
            {w.message}
          </li>
        ))}
      </ul>
    </div>
  );
}