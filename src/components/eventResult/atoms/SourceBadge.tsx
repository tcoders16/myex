// src/components/atoms/SourceBadge.tsx
export default function SourceBadge({ source }: { source?: string }) {
  let cls = "";
  let label = source ?? "extract";

  switch (source) {
    case "llm":
      cls =
        "bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 text-white shadow-md ring-1 ring-violet-300/40";
      label = "LLM";
      break;
    case "rules":
      cls =
        "bg-gradient-to-r from-emerald-400 via-lime-500 to-yellow-400 text-zinc-900 shadow-md ring-1 ring-emerald-300/40";
      label = "RULES";
      break;
    default:
      cls =
        "bg-gradient-to-r from-sky-400 via-cyan-500 to-blue-600 text-white shadow-md ring-1 ring-sky-300/40";
      label = "EXTRACT";
      break;
  }

  return (
    <span
      className={
        "inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide " +
        cls
      }
    >
      {label}
    </span>
  );
}