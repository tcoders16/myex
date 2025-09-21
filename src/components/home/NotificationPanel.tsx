// src/components/chrome/NotificationPanel.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function NotificationPanel() {
  const [show, setShow] = useState(true);

  // Optional auto-hide after 8s
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full bg-amber-50 text-amber-900 shadow-md border-b border-amber-200/70 overflow-hidden"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 text-sm">
            {/* Message */}
            <span className="font-medium flex items-center gap-2">
              🚧 <span>Additional feature under construction</span>
            </span>

            {/* Dismiss */}
            <button
              onClick={() => setShow(false)}
              className="ml-4 rounded-md px-3 py-1 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}