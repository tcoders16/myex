// src/components/activity/RecentActivity.tsx
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

type Item = { title: string; at: number };

export function logAddEvent(title: string) {
  const key = "ex:activity";
  const prev: Item[] = JSON.parse(localStorage.getItem(key) || "[]");
  const next = [{ title, at: Date.now() }, ...prev].slice(0, 8);
  localStorage.setItem(key, JSON.stringify(next));
}

export default function RecentActivity() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ex:activity");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  if (items.length === 0) return null;
  return (
    <aside className="rounded-2xl border border-zinc-200 bg-white/80 p-4">
      <div className="mb-2 text-xs font-semibold text-zinc-700">Recent activity</div>
      <ul className="space-y-2 text-sm text-zinc-700">
        {items.map((it, i) => (
          <li key={i} className="flex items-center justify-between gap-2">
            <span className="truncate">{it.title || "Untitled event"}</span>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="h-3.5 w-3.5" />
              {timeAgo(it.at)}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
function timeAgo(ts: number) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}