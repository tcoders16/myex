// src/components/eventResult/buttons/AddEventButton.tsx
import  { useMemo } from "react";
import { motion,  } from "framer-motion";
import { Loader2, CalendarPlus, Link as LinkIcon, Check, XCircle } from "lucide-react";

type ResultState = "idle" | "added" | "error";

type Props = {
  adding: boolean;
  disabled?: boolean;

  // action handlers
  onAdd: () => void | Promise<void>;
  onConnect: () => void | Promise<void>;

  // external connection state
  connected: boolean;
  connecting?: boolean;

  // visual result state (controlled by parent)
  result?: ResultState;

  titleWhenReady?: string;

  // UI extras (optional)
  fullWidth?: boolean;
  className?: string;

  "data-testid"?: string;
};

export default function AddEventButton({
  adding,
  disabled,
  onAdd,
  onConnect,
  connected,
  connecting = false,
  result = "idle",
  titleWhenReady = "Add to Google Calendar",
  fullWidth = false,
  className = "",
  ...rest
}: Props) {
  const isAdded = result === "added";
  const isError = result === "error";

  // Decide label/icon/behavior
  const { label, Icon } = useMemo(() => {
    if (!connected) {
      return {
        label: connecting ? "Connecting…" : "Connect Google to Add",
        Icon: connecting ? Loader2Spin : LinkIcon,
      };
    }
    if (adding) return { label: "Adding…", Icon: Loader2Spin };
    if (isAdded) return { label: "Added", Icon: Check };
    if (isError) return { label: "Try again", Icon: XCircle };
    return { label: titleWhenReady, Icon: CalendarPlus };
  }, [connected, connecting, adding, isAdded, isError, titleWhenReady]);

  // Disabled logic
  const isDisabled =
    !!disabled ||
    adding ||
    connecting ||
    isAdded; // avoid double-add while showing success

  // Color theme
  const tone = !connected
    ? "bg-amber-600 hover:bg-amber-600/90 focus-visible:ring-amber-600"
    : isError
    ? "bg-red-600 hover:bg-red-600/90 focus-visible:ring-red-600"
    : isAdded
    ? "bg-emerald-600 hover:bg-emerald-600/90 focus-visible:ring-emerald-600"
    : "bg-zinc-900 hover:bg-zinc-800 focus-visible:ring-zinc-900";

  // Subtle animation variants
  // const variants = {
  //   initial: { scale: 1, x: 0 },
  //   success: { scale: [1, 1.02, 1], transition: { duration: 0.35 } },
  //   error: {
  //     x: [0, -4, 4, -3, 3, -2, 2, 0],
  //     transition: { duration: 0.35 },
  //   },
  //   idle: { scale: 1, x: 0 },
  // } as const;

  // Pick animation state
  const animateState = isError ? "error" : isAdded ? "success" : "idle";

  async function handleClick() {
    if (isDisabled) return;
    if (!connected) {
      await onConnect();
      return;
    }
    await onAdd();
  }

  return (
    <motion.button
      initial="initial"
      animate={animateState}

      whileTap={{ scale: 0.97 }}
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      data-state={isAdded ? "added" : isError ? "error" : adding ? "adding" : "idle"}
      aria-live="polite"
      aria-busy={adding || connecting}
      className={[
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3.5 text-sm font-medium text-white shadow-md disabled:opacity-60",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        tone,
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      title={label}
      aria-label={label}
      {...rest}
    >
      <Icon className="h-4 w-4" />
      {label}
    </motion.button>
  );
}

function Loader2Spin(props: { className?: string }) {
  return <Loader2 {...props} className={["animate-spin", props.className].join(" ")} />;
}