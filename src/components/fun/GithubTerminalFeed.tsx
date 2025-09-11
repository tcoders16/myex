// src/components/fun/GithubTerminalFeed.tsx
import { useEffect, useState } from "react";

type GHEvent = {
  id: string;
  type: string;
  repo: { name: string };
  actor: { login: string };
  created_at: string;
  payload?: any;
};

export default function GithubTerminalFeed() {
  const [lines, setLines] = useState<string[]>([]);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("https://api.github.com/events");
        const json: GHEvent[] = await res.json();
        const cooked = json.slice(0, 8).map(formatEventLine);
        setLines(cooked);
      } catch {
        setLines(["⚠️ Failed to load GitHub feed"]);
      }
    }
    fetchEvents();
  }, []);

  // typewriter
  useEffect(() => {
    let i = 0;
    const script = lines.join("\n");
    setTyped("");

    const loop = setInterval(() => {
      setTyped((prev) => {
        if (i >= script.length) {
          clearInterval(loop);
          return prev;
        }
        i++;
        return script.slice(0, i);
      });
    }, 18);

    return () => clearInterval(loop);
  }, [lines]);

  return (
    <div className="mx-auto w-full max-w-3xl rounded-xl border border-[#1A3F1A] bg-[#071607] p-4 font-mono text-[#9FE870] shadow-lg">
      <pre className="whitespace-pre-wrap text-sm leading-relaxed">
        {typed}
        <span className="inline-block h-4 w-2 bg-[#9FE870] animate-pulse" />
      </pre>
    </div>
  );
}

function formatEventLine(ev: GHEvent): string {
  const repo = ev.repo?.name ?? "unknown/repo";
  const user = ev.actor?.login ?? "someone";
  switch (ev.type) {
    case "PushEvent": return `${user} pushed code to ${repo}`;
    case "IssuesEvent": return `${user} worked on issues in ${repo}`;
    case "PullRequestEvent": return `${user} updated a PR in ${repo}`;
    default: return `${user} did ${ev.type.replace(/Event$/, "")} in ${repo}`;
  }
}