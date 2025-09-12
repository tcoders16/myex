// src/components/marketing/InstallLocally.tsx
import { HardDrive, WifiOff, ShieldCheck } from "lucide-react";

export default function InstallLocally() {
  return (
    <section className="relative rounded-3xl border border-zinc-200 bg-white shadow-lg p-8 md:p-10">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">
        Install Locally — No Internet Needed
      </h2>

      {/* Subtext */}
      <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
        You can run this app directly on your own computer or office network.  
        It works without wifi, without sending data outside, and keeps everything
        private inside your company.
      </p>

      {/* Bullets in plain English */}
      <ul className="mt-5 space-y-3 text-sm text-zinc-800">
        <li className="flex items-center gap-2">
          <WifiOff className="h-5 w-5 text-emerald-500" />
          Works completely offline — no wifi or internet needed
        </li>
        <li className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          All information stays inside your own computers
        </li>
        <li className="flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-emerald-500" />
          Simple one-time install, then it runs automatically
        </li>
      </ul>

      {/* Call to action */}
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="mailto:solankiom@gmail.com?subject=Book a demo&body=Hi,%0D%0AWe’d like a demo to see how local install works for our team."
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow hover:bg-zinc-800"
        >
          Book a Demo
        </a>

        <a
          href="mailto:solankiom@gmail.com?subject=Install locally&body=Hi,%0D%0AWe’d like to install the app locally for our company.%0D%0APlease guide us through the steps."
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm hover:border-zinc-300 hover:shadow"
        >
          Install Locally
        </a>
      </div>

      {/* Tagline */}
      <p className="mt-4 text-xs text-zinc-500">
        Easy, private, and built for companies that want full control.
      </p>
    </section>
  );
}