import React from "react";
import {
  CalendarCheck2,
  Mail,
  MousePointerClick,
  SquarePen,
  Download,
} from "lucide-react";

/**
 * Event Extractor – Minimalistic Guide Page
 * Clean, white-focused layout with balanced spacing and simple steps.
 */

function Step({
  idx,
  title,
  desc,
  icon: Icon,
}: {
  idx: number;
  title: string;
  desc: string;
  icon: any;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-2">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-500 flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold">
          {idx}. {title}
        </h3>
      </div>
      <p className="text-sm text-neutral-600 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function EventExtractorGuide({ font }: { font?: string }) {
  return (
    <main className={`mx-auto max-w-5xl px-6 py-16 space-y-20 ${font || "font-sans"}`}>
      {/* Install & Setup */}
      <section className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Install & Setup</h1>
        <p className="text-neutral-600 max-w-2xl">
          Follow these steps to install the Event Extractor extension in Chrome.
        </p>
        <button className="rounded-full px-6 py-2.5 bg-black text-white font-medium hover:bg-neutral-800 flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Extension (.zip)
        </button>
        <div className="grid md:grid-cols-2 gap-6">
          <Step
            idx={1}
            title="Download & unzip"
            icon={Download}
            desc="Get the .zip file and extract it to a folder on your computer."
          />
          <Step
            idx={2}
            title="Open Chrome Extensions"
            icon={SquarePen}
            desc="Go to chrome://extensions in your Chrome browser."
          />
          <Step
            idx={3}
            title="Enable Developer Mode"
            icon={MousePointerClick}
            desc="Toggle Developer Mode on in the top-right corner."
          />
          <Step
            idx={4}
            title="Load unpacked"
            icon={Mail}
            desc="Select the unzipped folder to install the extension."
          />
          <Step
            idx={5}
            title="Connect Google Calendar"
            icon={CalendarCheck2}
            desc="Open the extension and click ‘Connect Google Calendar’ to finish setup."
          />
        </div>
      </section>

      {/* How to Use */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold tracking-tight">How to Use</h2>
        <p className="text-neutral-600 max-w-2xl">
          Once installed, here’s how you can capture and add events with one click.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <Step
            idx={1}
            title="Open your email"
            icon={Mail}
            desc="Works with Gmail and Outlook. Open any message that contains dates or schedules."
          />
          <Step
            idx={2}
            title="Highlight the details"
            icon={MousePointerClick}
            desc="Select text (e.g., ‘Thu 3:30–4pm at 123 Main St’) and click the floating Event Extractor button."
          />
          <Step
            idx={3}
            title="Review the draft"
            icon={SquarePen}
            desc="We prefill title, times, location, and attendees. Make edits if needed."
          />
          <Step
            idx={4}
            title="Add to Calendar"
            icon={CalendarCheck2}
            desc="Click ‘Add to Google Calendar’. Parsing stays local until this step."
          />
        </div>
      </section>

      {/* Tips */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-3">
        <h3 className="text-lg font-semibold">Tips</h3>
        <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
          <li>Use chapters in the demo video to jump to a section.</li>
          <li>Meeting links (Zoom/Meet/Teams) are detected automatically.</li>
          <li>If no end time is found, default duration is 1 hour.</li>
          <li>Everything runs locally until you add to Google Calendar.</li>
        </ul>
      </section>
    </main>
  );
}