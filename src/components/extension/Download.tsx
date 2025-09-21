// src/components/ExtensionDownload.tsx
import { Download } from "lucide-react";

function Step({ icon, text }: { icon: React.ReactNode; text: React.ReactNode }) {
  return (
    <li className="flex items-start gap-4">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white shadow-sm">
        {icon}
      </div>
      <span className="text-sm text-zinc-700">{text}</span>
    </li>
  );
}

export default function ExtensionDownload() {
  return (
    <section className="mx-auto max-w-6xl rounded-3xl border border-zinc-200 bg-white shadow-lg">
      {/* Header */}
      <div className="border-b border-zinc-200 px-8 py-8 text-center">
        <h2 className="text-3xl font-bold text-zinc-900">
          Mail Extractor – Chrome Extension
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Download the extension and install it manually in Chrome.
        </p>
      </div>

      {/* Body */}
      <div className="p-10 space-y-10">
        {/* Download button */}
        <div className="flex justify-center">
          <a
            href="/extension.zip"
            download
            className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-white shadow hover:bg-zinc-800 transition"
          >
            <Download className="h-5 w-5" />
            <span className="font-medium">Download Extension (.zip)</span>
          </a>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 text-center mb-6">
            How to install
          </h3>
          <ol className="space-y-5">
            <Step
              icon={<Download className="h-4 w-4 text-zinc-600" />}
              text="Download and unzip the file above."
            />
            <Step
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-zinc-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
                </svg>
              }
              text={
                <>
                  Open{" "}
                  <code className="rounded bg-zinc-100 px-1 py-0.5">
                    chrome://extensions
                  </code>{" "}
                  in Chrome.
                </>
              }
            />
            <Step
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-zinc-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                </svg>
              }
              text="Enable Developer Mode (toggle in the top right)."
            />
            <Step
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-zinc-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              }
              text="Click Load unpacked and select the unzipped folder."
            />
          </ol>

          <p className="mt-8 text-xs text-center text-zinc-500">
            ⚠️ Manual installs won’t auto-update. For global installs, we recommend publishing to the Chrome Web Store.
          </p>
        </div>
      </div>
    </section>
  );
}