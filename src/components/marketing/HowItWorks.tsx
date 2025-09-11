// src/components/help/HowItWorks.tsx
import { PlugZap, FileText, CalendarCheck } from "lucide-react";

export default function HowItWorks({ backendOk }: { backendOk?: boolean }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-6 pb-2">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-semibold text-zinc-900">
            How it works
          </h2>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${
              backendOk ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
            }`}
            title={backendOk ? "Local backend reachable" : "Waiting for backend"}
          >
            <PlugZap className="h-3.5 w-3.5" />
            {backendOk ? "Backend connected" : "Backend pending"}
          </span>
        </div>

        <ol className="mt-4 grid gap-3">
          <li className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3">
            <FileText className="h-5 w-5" />
            <div className="text-sm text-zinc-700">
              Open any page or document (Google Docs, Word Online, Notion, emails, articles).
              Select or just view the text with dates.
            </div>
          </li>
          <li className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3">
            <PlugZap className="h-5 w-5" />
            <div className="text-sm text-zinc-700">
              Click the floating <b>MEE</b> button (browser helper). It sends the visible/selected text to your{" "}
              <span className="font-medium">local backend</span> for extraction.
            </div>
          </li>
          <li className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3">
            <CalendarCheck className="h-5 w-5" />
            <div className="text-sm text-zinc-700">
              Review the extracted events below and click <b>Add to Calendar</b>.
            </div>
          </li>
        </ol>

        <p className="mt-4 text-xs text-zinc-500">
          Tip: If you don’t see the MEE button, enable the userscript/extension. You can also paste text into the app (see “Paste → Extract”).
        </p>
      </div>
    </section>
  );
}