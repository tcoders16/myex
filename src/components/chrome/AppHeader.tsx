// src/components/chrome/AppHeader.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Link as LinkIcon, X } from "lucide-react";
import { motion } from "framer-motion";
import ConnectGoogleCalendar from "../calendar/ConnectGoogleCalendar";
import Logo from "../logo/Logo";


/* Optional React Router support (falls back gracefully) */
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
  showBack?: boolean;
  backTo?: string;
  productName?: string;
  productTagline?: string;
};

export default function AppHeader({
  showBack,
  backTo,
  productName = "Event Extractor",
  productTagline = "Capture → Review → Add to Calendar",
}: Props) {
  const navigate = useNavigateHook ? useNavigateHook() : null;
  const location = useLocationHook ? useLocationHook() : null;

  const pathname =
    (location && location.pathname) ||
    (typeof window !== "undefined" ? window.location.pathname : "/");

  const resolvedShowBack =
    typeof showBack === "boolean" ? showBack : pathname !== "/";

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={[
        "chakra-petch-regular sticky top-0 z-40", // ✅ font applied globally
        "backdrop-blur supports-[backdrop-filter]:bg-white/55",
        "border-b",
        scrolled
          ? "bg-white/70 border-zinc-200 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.25)]"
          : "bg-white/40 border-zinc-100",
      ].join(" ")}
    >
      {/* thin gradient line */}
      <div className="pointer-events-none h-[2px] w-full bg-gradient-to-r from-indigo-400/40 via-sky-400/40 to-emerald-400/40" />

      <div className="mx-auto max-w-6xl px-5 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Back + Brand */}
          <div className="flex items-center gap-3">
            <BackButton navigate={navigate} backTo={backTo} show={resolvedShowBack} />

            <LinkEl to="/" className="group">
              <div className="flex items-center gap-3">
                {/* logo blob */}


                  <Logo/>



                <div className="leading-tight">
                  <div className="text-lg font-semibold tracking-tight text-zinc-900 group-hover:opacity-90">
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
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-700 shadow-sm transition hover:bg-white hover:shadow"
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Back</span>
    </button>
  );
}

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

  const btnLabel = useMemo(() => (open ? "Close" : "Connect"), [open]);

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white shadow hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        {/* sheen */}
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
          <motion.span
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 h-full w-1/3 -skew-x-12 bg-white/20"
          />
        </span>
        <LinkIcon className="h-4 w-4" />
        {btnLabel}
      </motion.button>

      {open && (
        <motion.div
          role="dialog"
          aria-label="Connect Google Calendar"
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="absolute right-0 mt-3 w-[380px] max-w-[92vw] rounded-2xl border border-zinc-200 bg-white/90 p-3 shadow-2xl backdrop-blur"
        >
          {/* arrow */}
          <div className="pointer-events-none absolute -top-2 right-6 h-4 w-4 rotate-45 rounded-sm border-l border-t border-zinc-200 bg-white/90" />

          <div className="flex items-center justify-between pb-2">
            <div className="text-sm font-semibold text-zinc-900">
              Connect Calendar
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-zinc-500 transition hover:bg-zinc-100"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white/70 p-3 shadow-sm">
            <ConnectGoogleCalendar />
          </div>

          <p className="mt-2 text-[11px] text-zinc-500">
            Secure • Private • Revoke anytime in your Google Account settings
          </p>
        </motion.div>
      )}
    </div>
  );
}