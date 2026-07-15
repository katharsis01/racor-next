export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: AnalyticsParams) => void;
  }
}

export function trackEvent(eventName: string, params?: AnalyticsParams) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", eventName, params);
}

export function classifyProductQuestion(question: string) {
  const normalized = question.toLowerCase();

  if (/precio|cuesta|coste|presupuesto/.test(normalized)) return "price";
  if (/talla|medida|xs|2xl|3xl/.test(normalized)) return "sizing";
  if (/calor|frío|frio|temperatura|verano|invierno/.test(normalized)) return "climate";
  if (/compar|diferencia|versus| vs /.test(normalized)) return "comparison";
  if (/club|equipo|grupeta/.test(normalized)) return "team_order";
  if (/plazo|entrega|tarda|envío|envio/.test(normalized)) return "delivery";
  if (/devol|cambio|lavado|cuidado/.test(normalized)) return "policy_care";
  return "product_information";
}
