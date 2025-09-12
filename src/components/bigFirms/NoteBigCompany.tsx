// src/components/marketing/NoteBigCompany.tsx
import { Building2, ShieldCheck, WifiOff } from "lucide-react";



export default function NoteBigCompany() {
  return (
    <section className="relative rounded-3xl border border-zinc-200 bg-white shadow-lg p-8 md:p-10 text-center">
      {/* Icon */}
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
        <Building2 className="h-7 w-7 text-emerald-600" />
      </div>

      {/* Heading */}
      <h2 className="mt-4 text-2xl md:text-3xl font-bold text-zinc-900">
        Built for Big Companies
      </h2>

      {/* Subheading */}
      <p className="mt-3 text-sm text-zinc-600 leading-relaxed max-w-xl mx-auto">
        We know large organizations have unique needs.  
        That’s why this app can run <strong>fully offline</strong>,  
        keeping all of your information private inside your own systems.
      </p>

      {/* Features */}
      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-zinc-800 max-w-3xl mx-auto">
        <li className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <WifiOff className="h-5 w-5 text-emerald-500" />
          Works without internet
        </li>
        <li className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          All data stays with you
        </li>
        <li className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <Building2 className="h-5 w-5 text-emerald-500" />
          Easy setup across teams
        </li>
      </ul>

      {/* Call-to-action */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href="mailto:solankiom@gmail.com?subject=Demo request&body=Hi,%0D%0AWe’d like a demo to understand how this app works for our company.%0D%0AOur company: ____%0D%0AStakeholders: ____%0D%0ATimeline: ____"
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow hover:bg-zinc-800"
        >
          Book a Demo
        </a>
        <a
          href="mailto:solankiom@gmail.com?subject=Install locally&body=Hi,%0D%0AWe’d like to install this app locally for our company.%0D%0ACompany: ____%0D%0ATeam size: ____%0D%0ATimeline: ____"
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-900 shadow-sm hover:border-zinc-300 hover:shadow"
        >
          Install Locally
        </a>

      </div>

      {/* Tagline */}
      <p className="mt-4 text-xs text-zinc-500">
        Trusted by teams that care about privacy, control, and simplicity.
      </p>
    </section>
  );
}