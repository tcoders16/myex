// src/components/toast/useToast.tsx
import { createContext, useContext, useState, useCallback } from "react";

type T = { id: number; kind: "success" | "error"; msg: string };
const Ctx = createContext<{ push: (t: Omit<T, "id">) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<T[]>([]);
  const push = useCallback((t: Omit<T, "id">) => {
    const id = Date.now();
    setItems((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 2500);
  }, []);
  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] space-y-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`rounded-lg border px-3 py-2 text-sm shadow ${
              t.kind === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("ToastProvider missing");
  return ctx;
}