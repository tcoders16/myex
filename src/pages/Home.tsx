// ========== file: src/pages/Home.tsx ==========
import {  useState,useMemo } from "react";

import HowItWorks from "../components/marketing/HowItWorks";
import { useLatestExtract } from "../hooks/useLatestExtract";
import { normalizeEvents } from "../types/extract";
import Hero from "../components/home/Hero";
import Notice from "../components/home/Notice";
import SafeResults from "../components/home/SafeResults";

export default function Home({ font }: { font: string }) {
  const { data, loading, error } = useLatestExtract("http://127.0.0.1:4000");
  const events = useMemo(() => normalizeEvents(data), [data]);
  const backendOk = !error;

  // const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);



  
  return (
    <div className={`${font} relative min-h-screen overflow-x-hidden bg-[radial-gradient(80rem_60rem_at_50%_-10rem,rgba(0,0,0,0.06),transparent),radial-gradient(60rem_40rem_at_-10%_10%,rgba(0,0,0,0.05),transparent)]`}>
      {/* background grid */}
      <div className="pointer-events-none fixed inset-0 -z-[1] bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />



      {/* Hero */}
      <Hero ok={backendOk} loading={loading && !data} />

      {/* How It Works */}
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <HowItWorks backendOk={backendOk} />
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-6">
        {/* Notices */}
        {error && <Notice type="error" message={`Backend unreachable: ${error}`} />}
        {notice && !error && <Notice type="info" message={notice} />}

        {/* Extracted Events */}
        <SafeResults events={events} data={data} />
      </main>


    </div>
  );
}
