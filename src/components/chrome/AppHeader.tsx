// src/components/chrome/AppHeader.tsx
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Link as LinkIcon, X } from "lucide-react";
import ConnectGoogleCalendar from "../calendar/ConnectGoogleCalendar";

// Optional React Router support (falls back gracefully)
let LinkComp: any = null;
let useNavigateHook: any = null;
let useLocationHook: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rr = require("react-router-dom");
  LinkComp = rr.Link;
  useNavigateHook = rr.useNavigate;
  useLocationHook = rr.useLocation;
} catch (_) {}

type Props = {
  showBack?: boolean; // if undefined, auto-hide on "/"
  backTo?: string;

  // Branding
  productName?: string;      // default: "ex"
  productTagline?: string;   // default: "Multi-surface apps"
};

export default function AppHeader({
  showBack,
  backTo,
  productName = "ex",
  productTagline = "Multi-surface apps",
}: Props) {
  const navigate = useNavigateHook ? useNavigateHook() : null;
  const location = useLocationHook ? useLocationHook() : null;

  const pathname =
    (location && location.pathname) ||
    (typeof window !== "undefined" ? window.location.pathname : "/");

  const resolvedShowBack =
    typeof showBack === "boolean" ? showBack : pathname !== "/";

  const LinkEl: React.FC<
    { to: string; className?: string } & React.PropsWithChildren
  > = ({ to, className, children }) =>
    LinkComp ? (
      <LinkComp to={to} className={className}>
        {children}
      </LinkComp>
    ) : (
      <a href={to} className={className}>
        {children}
      </a>
    );

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-5 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Back + Brand */}
          <div className="flex items-center gap-3">
            <BackButton navigate={navigate} backTo={backTo} show={resolvedShowBack} />
            <LinkEl to="/" className="group">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500 shadow-sm" />
                <div className="leading-tight">
                  <div className="text-lg font-semibold text-zinc-900 group-hover:opacity-90">
                    {productName}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-zinc-500">
                    {productTagline}
                  </div>
                </div>
              </div>
            </LinkEl>
          </div>

          {/* Right: Connect popover */}
          <CalendarConnectPopover />
        </div>
      </div>
    </header>
  );
}

/* ------------------------ Subcomponents ------------------------ */

function BackButton({
  navigate,
  backTo,
  show,
}: {
  navigate: any;
  backTo?: string;
  show: boolean;
}) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  if (!show || pathname === "/") return null;

  const goBack = () => {
    if (navigate && backTo) navigate(backTo);
    else if (navigate && !backTo) navigate(-1);
    else if (backTo) window.location.href = backTo;
    else window.history.back();
  };

  return (
    <button
      onClick={goBack}
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white/60 px-3 py-2 text-sm text-zinc-700 hover:bg-white hover:shadow-sm"
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Back</span>
    </button>
  );
}

/** Small popover that shows <ConnectGoogleCalendar /> */
function CalendarConnectPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Close on outside click / Esc
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white shadow hover:bg-zinc-800"
      >
        <LinkIcon className="h-4 w-4" />
        Connect
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Connect Google Calendar"
          className="absolute right-0 mt-2 w-[360px] max-w-[90vw] overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 p-3 shadow-xl backdrop-blur"
        >
          <div className="flex items-center justify-between pb-2">
            <div className="text-sm font-semibold text-zinc-900">
              Connect Calendar
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Your UI-only component goes here */}
          <div className="rounded-xl border border-zinc-200 bg-white/70 p-3">
            <ConnectGoogleCalendar />
          </div>

          <p className="mt-2 text-[11px] text-zinc-500">
            Secure • Private • Revoke anytime in your Google Account settings
          </p>
        </div>
      )}
    </div>
  );
}