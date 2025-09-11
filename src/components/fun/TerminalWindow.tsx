// src/components/fun/TerminalWindow.tsx
import { memo, type ReactNode } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

type Theme = "green" | "amber" | "mono";

type Props = {
  title?: string;                 // top-left label
  status?: string;                // top-right label (e.g., "online", "fetching…")
  theme?: Theme;                  // visual preset
  children: ReactNode;            // your <pre> or content
  footer?: ReactNode;             // optional bottom bar
  className?: string;             // extra wrapper classes
  bodyClassName?: string;         // customize padding/typography
  onClose?: () => void;           // optional close button
  maxWidthClass?: string;         // defaults to max-w-3xl
  elevate?: boolean;              // bigger drop shadow
};

const themeMap: Record<Theme, {
  bg: string;
  border: string;
  headerBorder: string;
  text: string;
  glow: string;
  neon: string;
}> = {
  green: {
    bg: "bg-[#071607]",
    border: "border-[#1A3F1A]",
    headerBorder: "border-[#194019]",
    text: "text-[#9FE870]",
    glow: "shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
    neon: "from-emerald-300/30 via-teal-300/25 to-lime-300/25",
  },
  amber: {
    bg: "bg-[#191204]",
    border: "border-[#3F2A0E]",
    headerBorder: "border-[#4A320F]",
    text: "text-[#FFD37A]",
    glow: "shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
    neon: "from-amber-300/30 via-yellow-300/25 to-orange-300/25",
  },
  mono: {
    bg: "bg-[#07090B]",
    border: "border-[#1E2630]",
    headerBorder: "border-[#1E2630]",
    text: "text-zinc-100",
    glow: "shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
    neon: "from-cyan-300/25 via-indigo-300/20 to-fuchsia-300/20",
  },
};

function clsx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default memo(function TerminalWindow({
  title = "terminal",
  status,
  theme = "green",
  children,
  footer,
  className,
  bodyClassName,
  onClose,
  maxWidthClass = "max-w-3xl",
  elevate = true,
}: Props) {
  const T = themeMap[theme];

  return (
    <div className={clsx("mx-auto w-full", maxWidthClass, className)}>
      <div
        className={clsx(
          "relative overflow-hidden rounded-2xl border",
          T.bg,
          T.border,
          elevate && T.glow
        )}
        role="region"
        aria-label={title}
      >
        {/* thin neon strip on top */}
        <div className={clsx("pointer-events-none h-[2px] w-full bg-gradient-to-r", T.neon)} />

        {/* header */}
        <div className={clsx("relative flex h-8 items-center justify-between border-b px-3", T.headerBorder)}>
          <div className="flex items-center gap-2">
            {/* traffic dots */}
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ffd93d]" />
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#6bff95]" />
            <span className={clsx("ml-2 text-[11px] font-semibold uppercase tracking-wider", T.text)}>
              {title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {status && (
              <span className={clsx("text-[11px] opacity-90", T.text)}>
                {status}
              </span>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close terminal"
                className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white/80"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {/* shimmer in header */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            initial={{ x: "-20%" }}
            animate={{ x: "120%" }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
            }}
          />
        </div>

        {/* body */}
        <div className={clsx("relative p-4", bodyClassName)}>
          {/* your content */}
          <div className={clsx("font-mono text-[12.5px] leading-relaxed", T.text)}>
            {children}
          </div>

          {/* scanlines */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 3px)",
            }}
          />
        </div>

        {/* footer (optional) */}
        {footer && (
          <div className={clsx("border-t px-4 py-2", T.headerBorder)}>
            <div className={clsx("text-[11px]", T.text)}>{footer}</div>
          </div>
        )}
      </div>
    </div>
  );
});