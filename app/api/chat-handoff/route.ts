import { NextResponse } from "next/server";

/**
 * Aviso por Telegram cuando el cliente pulsa «Resumen por WhatsApp» en el chat.
 * Requiere TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID; sin ellas no hace nada.
 */

const MAX_SUMMARY_CHARS = 3500;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_IP = 5;
const MAX_GLOBAL = 60;

const hits = new Map<string, number[]>();

function allow(key: string, max: number, now: number) {
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

function clientIp(req: Request) {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function POST(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return NextResponse.json({ ok: false, configured: false });

  let data: { summary?: unknown; product?: unknown; source?: unknown };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const summary = typeof data.summary === "string" ? data.summary.trim() : "";
  if (!summary) return NextResponse.json({ error: "Resumen vacío" }, { status: 422 });

  const now = Date.now();
  if (!allow(`ip:${clientIp(req)}`, MAX_PER_IP, now) || !allow("global", MAX_GLOBAL, now)) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }

  const product = typeof data.product === "string" ? data.product.slice(0, 120) : "";
  const source = data.source === "designers" ? "designers" : "whatsapp";
  const text = [
    "Nuevo cliente desde el chat de racorsport.cc",
    source === "designers"
      ? "El cliente ha enviado su resumen a diseño desde el chat."
      : "Ha pulsado «Resumen por WhatsApp» (puede que no llegue a enviarlo).",
    product ? `Página de producto: ${product}` : undefined,
    "",
    Array.from(summary).slice(0, MAX_SUMMARY_CHARS).join(""),
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error("[chat-handoff] Telegram respondió", response.status);
      return NextResponse.json({ ok: false }, { status: 502 });
    }
  } catch (error) {
    console.error("[chat-handoff] Error enviando a Telegram:", error);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
