// src/components/chrome/AppFooter.tsx
export default function AppFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} MEE — Mail Event Extractor
        </p>
        <nav className="text-xs text-zinc-600">
          <a className="hover:text-zinc-900" href="#privacy">Privacy</a>
          <span className="mx-3 text-zinc-300">•</span>
          <a className="hover:text-zinc-900" href="#terms">Terms</a>
          <span className="mx-3 text-zinc-300">•</span>
          <a className="hover:text-zinc-900" href="#support">Support</a>
        </nav>
      </div>
    </footer>
  );
}