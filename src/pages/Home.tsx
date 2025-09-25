// ========== file: src/pages/Home.tsx ==========
import { useMemo, useState } from "react";

import Hero from "../components/home/Hero";
import Notice from "../components/home/Notice";
import SafeResults from "../components/home/SafeResults";
import HealthPing from "../components/system/HealthPing";
import WelcomeEmpty from "../components/empty/WelcomeEmpty";
import HowItWorks from "../help/HowItWorks";

import { useLatestExtract } from "../hooks/useLatestExtract";
import { normalizeEvents, type ExtractionResultLite } from "../types/extract";
import NoteBigCompany from "../components/bigFirms/NoteBigCompany";
import ExtensionDownload from "../components/extension/Download";
// import GithubTerminalFeed from "../components/fun/GithubTerminalFeed";

// Import the new component


export default function Home({ font }: { font: string }) {
  const { data, loading, error } = useLatestExtract(`${import.meta.env.VITE_API_BASE}`);
  const events = useMemo(() => normalizeEvents(data), [data]);
  const backendOk = !error;

  const [notice] = useState<string | null>(null);

  return (
    <div
      className={[
        font,
        "relative min-h-screen overflow-x-hidden",
        "bg-[radial-gradient(80rem_60rem_at_50%_-10rem,rgba(0,0,0,0.06),transparent),radial-gradient(60rem_40rem_at_-10%_10%,rgba(0,0,0,0.05),transparent)]",
      ].join(" ")}
    >
      {/* background grid */}
      <div className="pointer-events-none fixed inset-0 -z-[1] bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />

      {/* Status strip */}
      <div className="mx-auto max-w-6xl px-6 pt-3">
        <HealthPing />
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-6xl px-6 -mt-4">
        <Hero ok={backendOk} loading={loading && !data} />
      </div>

      {/* How it works */}
      <div className="mx-auto max-w-6xl px-6 -mt-2">
        <HowItWorks backendOk={backendOk} />
      </div>

      {/* New: Extension Download */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <ExtensionDownload />
      </div>

      {/* Main */}
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-6 -mt-2">
        {error && <Notice type="error" message={`Backend unreachable: ${error}`} />}
        {notice && !error && <Notice type="info" message={notice} />}

        {/* Content */}
        {!loading && events.length === 0 ? (
          <div className="mx-auto max-w-6xl md:w-[min(880px,100%)] shadow-lg rounded-2xl">
            <WelcomeEmpty />
          </div>
        ) : (
          <div className="mx-auto shadow-lg rounded-2xl">
            <SafeResults
              className="w-full self-start"
              events={events}
              data={data as ExtractionResultLite | undefined}
            />
          </div>
        )}

        <div className="mx-auto max-w-6xl px-6 py-6">
          <NoteBigCompany />
        </div>
      </main>
    </div>
  );
}