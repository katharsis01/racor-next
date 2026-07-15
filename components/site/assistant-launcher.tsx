"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const ASSISTANT_OPEN_EVENT = "racor:open-product-assistant";

export function AssistantLauncher({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(ASSISTANT_OPEN_EVENT))}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 border border-neutral-900 bg-neutral-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
        className
      )}
    >
      <MessageCircle className="size-4.5" aria-hidden="true" />
      Preguntar al asistente
    </button>
  );
}
