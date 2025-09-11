// src/context/GoogleCalendarAuthContext.tsx
import React, { createContext, useContext } from "react";
import { useGoogleCalendarAuth, type UseGoogleCalendarAuth } from "../hooks/useGoogleCalendarAuth";

const Ctx = createContext<UseGoogleCalendarAuth | null>(null);

export function GoogleCalendarAuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useGoogleCalendarAuth(); // single instance
  return <Ctx.Provider value={auth}>{children}</Ctx.Provider>;
}

export function useGoogleCalendarAuthCtx(): UseGoogleCalendarAuth {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGoogleCalendarAuthCtx must be used within GoogleCalendarAuthProvider");
  return ctx;
}