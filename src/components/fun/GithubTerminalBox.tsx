// Example: src/components/fun/GithubTerminalBox.tsx
import { useEffect, useState } from "react";
import TerminalWindow from "./TerminalWindow";

export default function GithubTerminalBox() {
  const [typed, setTyped] = useState("connecting to github…\n");

  useEffect(() => {
    const script = `connecting to github… ok
scanning public events…

• torvalds pushed 1 commit to linux
• vercel updated a PR in next.js
• someone starred remix-run/remix

press q to quit ・ press r to refresh`;
    let i = 0;
    setTyped("");
    const id = setInterval(() => {
      i++;
      setTyped(script.slice(0, i));
      if (i >= script.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, []);

  return (
    <TerminalWindow
      title="github feed"
      status="online"
      theme="green"
      footer="tip: use TAB/ENTER in the tasks terminal to schedule to your calendar"
      maxWidthClass="max-w-3xl"
    >
      <pre className="whitespace-pre-wrap break-words">
        {typed}
        <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-current align-[-2px]" />
      </pre>
    </TerminalWindow>
  );
}