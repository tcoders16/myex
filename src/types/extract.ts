// src/types/extract.ts
export type ISO8601 = string & { readonly __brand: "ISO8601" };

export type EventLite = {
  title?: string;
  start?: ISO8601;
  end?: ISO8601;
  allDay?: boolean;
  timezone?: string;
  source?: "rules" | "llm";
  confidence?: number;
  location?: string;
  description?: string;
  url?: string;
};


export type ExtractionResultLite = {
  events: EventLite[];
  degraded?: boolean;
  warnings?: ExtractionWarning[];
};

export type ExtractionWarning = {
  code:
    | "RELATIVE_DATE"
    | "TIMEZONE_ASSUMED"
    | "END_BEFORE_START_DROPPED"
    | "BAD_ISO_DROPPED"
    | "EMPTY_TEXT"
    | "LLM_TIMEOUT"
    | "LLM_BAD_JSON"
    | "OTHER";
  message: string;
  context?: Record<string, unknown>;
};

export type ExtractionMeta = {
  strategy?: "llm-first" | "rules-first" | "llm-then-rules" | "rules-then-llm";
  timings?: { totalMs: number; llmMs?: number; rulesMs?: number };
  model?: string;
  degradedReason?: string;
};

export type ExtractionResult = {
  events: EventLite[];
  degraded: boolean;
  warnings?: ExtractionWarning[];
  meta?: ExtractionMeta;
};

// ---- UI helpers ----
export function normalizeEvents(res?: ExtractionResult | null): EventLite[] {
  if (!res || !Array.isArray(res.events)) return [];
  return res.events.filter(e => !!e?.title && !!e?.start);
}