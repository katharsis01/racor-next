"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics-events";

export function AnalyticsEvents() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const tracked = target.closest<HTMLElement>("[data-analytics-event]");
      if (!tracked) return;

      const eventName = tracked.dataset.analyticsEvent;
      if (!eventName) return;

      trackEvent(eventName, {
        product: tracked.dataset.analyticsProduct,
        destination: tracked.getAttribute("href") ?? undefined,
      });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
