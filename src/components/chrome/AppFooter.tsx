// src/components/chrome/AppFooter.tsx
import { motion } from "framer-motion";

export default function AppFooter() {
  return (
    <footer className="relative border-t border-zinc-200 bg-white chakra-petch-regular">
      {/* Neon gradient line */}
      <div className="absolute top-0 left-0 h-[0.4px] w-full bg-gradient-to-r from-[#00f6ff] via-[#ff00ff] to-[#00ff90]" />

      <div className="mx-auto max-w-6xl px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-zinc-800">Event Extractor</span>
          {" • "}
          <a
            href="https://lawline.tech/Omkumar-portfolio"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-600 hover:text-zinc-900 transition"
          >
            Omkumar Solanki
          </a>
        </p>

        {/* Links */}
        <nav className="flex items-center gap-4 text-xs text-zinc-600">
          <motion.a
            href="https://lawline.tech"
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -1 }}
            className="transition hover:text-zinc-900"
          >
            Lawline
          </motion.a>
          <span className="text-zinc-300">•</span>
          <motion.a
            href="#privacy"
            whileHover={{ y: -1 }}
            className="transition hover:text-zinc-900"
          >
            Privacy
          </motion.a>
          <span className="text-zinc-300">•</span>
          <motion.a
            href="#terms"
            whileHover={{ y: -1 }}
            className="transition hover:text-zinc-900"
          >
            Terms
          </motion.a>
          <span className="text-zinc-300">•</span>
          <motion.a
            href="#support"
            whileHover={{ y: -1 }}
            className="transition hover:text-zinc-900"
          >
            Support
          </motion.a>
        </nav>
      </div>
    </footer>
  );
}