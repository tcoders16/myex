// src/components/account/GoogleAccountChip.tsx
// import { useEffect, useState } from "react";
// import { User2 } from "lucide-react";

// export default function GoogleAccountChip() {
//   const [email, setEmail] = useState<string | null>(null);
//   useEffect(() => {
//     let live = true;
//     (async () => {
//       try {
//         const r = await fetch("/api/google/profile", { credentials: "include" });
//         if (!live) return;
//         if (r.ok) {
//           const j = await r.json(); // { email?: string }
//           setEmail(j?.email ?? null);
//         }
//       } catch {}
//     })();
//     return () => {
//       live = false;
//     };
//   }, []);
//   if (!email) return null;
//   return (
//     <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs text-zinc-700">
//       <User2 className="h-3.5 w-3.5 text-zinc-500" />
//       <span className="truncate max-w-[180px]">{email}</span>
//     </span>
//   );
// }