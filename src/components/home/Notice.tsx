export default function Notice({ type, message }: { type: "error" | "info"; message: string }) {
  const base = "rounded-xl border px-3 py-2 text-sm";
  if (type === "error")
    return <div className={`${base} border-rose-200 bg-rose-50 text-rose-700`}>{message}</div>;
  return <div className={`${base} border-zinc-200 bg-zinc-50 text-zinc-800`}>{message}</div>;
}