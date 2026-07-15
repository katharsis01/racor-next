import { NextResponse } from "next/server";

/**
 * Recepción del formulario de contacto.
 *
 * Hoy: valida y registra la solicitud en el log del servidor.
 * Producción — dos opciones (ver lib/integrations/README.md):
 *  1. Email: instalar `resend` y enviar a racorcycling@gmail.com
 *     (RESEND_API_KEY en .env.local).
 *  2. Base de datos: guardar en Supabase tabla `leads`
 *     (NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY).
 */
export async function POST(req: Request) {
  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  // Honeypot
  if (data.web) return NextResponse.json({ ok: true });

  const nombre = data.nombre?.trim();
  const email = data.email?.trim();
  const mensaje = data.mensaje?.trim();
  if (!nombre || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !mensaje) {
    return NextResponse.json({ error: "Campos obligatorios" }, { status: 422 });
  }

  const lead = {
    nombre,
    email,
    telefono: data.telefono?.trim() || null,
    club: data.club?.trim() || null,
    prendas: data.prendas || null,
    cantidad: data.cantidad || null,
    fecha: data.fecha || null,
    mensaje,
    recibido: new Date().toISOString(),
  };

  // TODO producción: enviar con Resend y/o guardar en Supabase.
  console.log("[contacto] Nueva solicitud:", lead);

  return NextResponse.json({ ok: true });
}
