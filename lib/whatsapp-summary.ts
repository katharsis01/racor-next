import type { UIMessage } from "ai";
import { getProductByHandle, products } from "@/lib/commerce/local";

export const RACOR_CHAT_WHATSAPP = "34652602523";

const FALLBACK_TEXT = "Hola RACOR, necesito ayuda con una equipación.";
const PENDING = "Pendiente de confirmar";

const MODE_PROMPTS = [
  "necesito ayuda con mi talla y ajuste",
  "quiero preparar una equipacion personalizada para mi club",
  "quiero encontrar la prenda adecuada para mi uso",
  "necesito ayuda con produccion, envios, logos o reposiciones",
];

const GARMENTS: Array<{ label: string; terms: RegExp }> = [
  { label: "Maillot", terms: /\bmaillots?\b/ },
  { label: "Culotte", terms: /\bculottes?\b|\bculots?\b/ },
  { label: "Chaqueta", terms: /\bchaquetas?\b/ },
  { label: "Chaleco", terms: /\bchalecos?\b/ },
  { label: "Mono / body", terms: /\bmonos?\b|\bbody\b|\btrisuit\b/ },
  { label: "Manguitos / perneras", terms: /\bmanguitos?\b|\bperneras?\b/ },
  { label: "Equipación completa", terms: /\bequipaci(?:o|ó)n(?:es)? complet/ },
];

const QUANTITY_UNITS =
  "unidades|uds?|maillots?|culottes?|chaquetas?|chalecos?|prendas?|equipaciones|ciclistas|corredores|personas|miembros|socios|monos?|kits?";

const SIZE_TOKEN = "XXS|XS|S|M|L|XL|XXL|XXXL|2XL|3XL|4XL";

const MONTHS =
  "enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function messageText(message: UIMessage) {
  return message.parts
    .flatMap((part) => (part.type === "text" ? [part.text] : []))
    .join(" ")
    .trim();
}

function customerMessages(messages: UIMessage[]) {
  return messages
    .filter((message) => message.role === "user")
    .map(messageText)
    .filter((text) => text && !MODE_PROMPTS.some((prompt) => normalize(text).includes(prompt)));
}

function detectProducts(text: string, contextHandle?: string) {
  const normalized = normalize(text);
  const found = new Set<string>();

  const titles = products
    .map((product) => product.title)
    .sort((a, b) => b.length - a.length);
  let remaining = normalized;
  for (const title of titles) {
    const key = normalize(title);
    if (!remaining.includes(key)) continue;
    found.add(title);
    remaining = remaining.replaceAll(key, " ");
  }

  for (const garment of GARMENTS) {
    if (garment.terms.test(normalized)) found.add(garment.label);
  }

  const contextProduct = contextHandle ? getProductByHandle(contextHandle) : undefined;
  if (contextProduct && !found.size) found.add(contextProduct.title);

  if (!found.size) return undefined;
  const label = [...found].join(", ");
  if (!/personaliz|custom|disen|\blogos?\b/.test(normalized)) return label;
  return `${label} ${found.size > 1 ? "personalizados" : "personalizado"}`;
}

function detectSizes(text: string) {
  const pattern = new RegExp(`(\\d{1,4})\\s*(?:de\\s+(?:la\\s+)?(?:talla\\s+)?)?(${SIZE_TOKEN})\\b`, "gi");
  const sizes = new Map<string, number>();

  for (const match of text.matchAll(pattern)) {
    const size = match[2].toUpperCase();
    sizes.set(size, (sizes.get(size) ?? 0) + Number(match[1]));
  }

  if (!sizes.size) return undefined;
  return {
    label: [...sizes].map(([size, count]) => `${count} ${size}`).join(", "),
    total: [...sizes.values()].reduce((sum, count) => sum + count, 0),
  };
}

function detectQuantity(text: string, sizesTotal?: number) {
  const normalized = normalize(text);
  const explicit = [
    ...normalized.matchAll(new RegExp(`(\\d{1,4})\\s+(?:\\w+\\s+)?(?:${QUANTITY_UNITS})\\b`, "g")),
    ...normalized.matchAll(/\bsomos\s+(\d{1,4})\b/g),
  ].map((match) => Number(match[1]));

  if (explicit.length) return `${Math.max(...explicit)} unidades`;
  if (sizesTotal) return `${sizesTotal} unidades`;
  return undefined;
}

function detectDesign(text: string) {
  const normalized = normalize(text);
  const format = normalized.match(/\b(pdf|ai|svg|eps|png|jpe?g|psd)\b/);
  if (format) return `${format[1].toUpperCase()} disponible`;
  if (/sin disen|no tengo disen|no tenemos disen/.test(normalized)) return "Necesita propuesta de diseño";
  if (/\b(tengo|tenemos|adjunto|envio|nuestro|nuestra|mi)\b.*\b(disen\w*|logos?|boceto)\b/.test(normalized)) {
    return "Tengo diseño o logo";
  }
  return undefined;
}

function detectDate(text: string) {
  const normalized = normalize(text);
  const dayMonth = normalized.match(new RegExp(`\\b(\\d{1,2})\\s+de\\s+(${MONTHS})\\b`));
  if (dayMonth) return `${dayMonth[1]} de ${dayMonth[2]}`;

  const numeric = normalized.match(/\b(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?\b/);
  if (numeric) return numeric[0];

  const month = normalized.match(new RegExp(`\\b(?:para|en|antes de|a finales de|a principios de)\\s+(${MONTHS})\\b`));
  if (month) return month[0];

  return undefined;
}

function detectBudget(text: string) {
  const match = text.match(/(\d[\d.,]*)\s*(?:€|euros?)/i);
  return match ? `${match[1]} €` : undefined;
}

function truncate(text: string, maxChars: number) {
  return Array.from(text).slice(0, maxChars).join("");
}

export function buildWhatsAppSummary(messages: UIMessage[], contextHandle?: string) {
  const notes = customerMessages(messages);
  if (!notes.length) return FALLBACK_TEXT;

  const text = notes.join("\n");
  const sizes = detectSizes(text);

  const lines = [
    "Hola, he hablado con el asistente de RACOR y quiero continuar mi pedido.",
    "",
    "*Solicitud de presupuesto — RACOR*",
    "",
    `Producto: ${detectProducts(text, contextHandle) ?? PENDING}`,
    `Cantidad: ${detectQuantity(text, sizes?.total) ?? PENDING}`,
    `Tallas: ${sizes?.label ?? PENDING}`,
    `Diseño: ${detectDesign(text) ?? PENDING}`,
    `Fecha deseada: ${detectDate(text) ?? PENDING}`,
    `Presupuesto: ${detectBudget(text) ?? PENDING}`,
    "",
    "Lo que he contado al asistente:",
    ...notes.slice(-5).map((note) => `- ${truncate(note.replace(/\s+/g, " "), 280)}`),
  ];

  return lines.join("\n");
}

export function whatsAppLink(text: string, phone = RACOR_CHAT_WHATSAPP) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
