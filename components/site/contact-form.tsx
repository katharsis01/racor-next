"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const GARMENT_OPTIONS = [
  "Maillots",
  "Maillots manga larga",
  "Chaquetas",
  "Chalecos",
  "Culottes cortos",
  "Culottes largos",
  "Monos / CRI",
];

type Status = "idle" | "sending" | "ok" | "error";

const inputCls =
  "w-full border-b border-neutral-400 bg-transparent py-2.5 text-[15px] outline-none transition-colors focus:border-neutral-900 placeholder:text-neutral-400";
const labelCls =
  "mb-1 block text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500";

export function ContactForm({ defaultMensaje }: { defaultMensaje?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    // Honeypot anti-spam: si está relleno, es un bot
    if (data.web) return;

    const errs: Record<string, string> = {};
    if (!data.nombre?.trim()) errs.nombre = "Dinos tu nombre";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? ""))
      errs.email = "Introduce un email válido";
    if (!data.mensaje?.trim() || data.mensaje.trim().length < 10)
      errs.mensaje = "Cuéntanos un poco más (mín. 10 caracteres)";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="border border-neutral-900 p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto mb-4 size-8" />
        <h3 className="mb-2 text-lg font-bold uppercase">Mensaje enviado</h3>
        <p className="text-sm text-neutral-500">
          Gracias por escribirnos. Te respondemos en 24–48 h laborables con una
          propuesta.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {/* Honeypot (oculto para humanos) */}
      <input
        type="text"
        name="web"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className={labelCls}>
            Nombre *
          </label>
          <input
            id="nombre"
            name="nombre"
            autoComplete="name"
            className={cn(inputCls, errors.nombre && "border-red-600")}
            placeholder="Tu nombre"
          />
          {errors.nombre && (
            <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={cn(inputCls, errors.email && "border-red-600")}
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="telefono" className={labelCls}>
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            autoComplete="tel"
            className={inputCls}
            placeholder="Opcional"
          />
        </div>
        <div>
          <label htmlFor="club" className={labelCls}>
            Club / Equipo
          </label>
          <input id="club" name="club" className={inputCls} placeholder="Opcional" />
        </div>
        <div>
          <label htmlFor="prendas" className={labelCls}>
            Tipo de prendas
          </label>
          <select id="prendas" name="prendas" className={cn(inputCls, "cursor-pointer")}>
            <option value="">Selecciona…</option>
            {GARMENT_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
            <option value="Equipación completa">Equipación completa</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div>
          <label htmlFor="cantidad" className={labelCls}>
            Cantidad aproximada
          </label>
          <input
            id="cantidad"
            name="cantidad"
            type="number"
            min={1}
            className={inputCls}
            placeholder="p. ej. 15"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="fecha" className={labelCls}>
            ¿Para cuándo la necesitas?
          </label>
          <input id="fecha" name="fecha" type="date" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="mensaje" className={labelCls}>
            Cuéntanos tu idea *
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows={5}
            defaultValue={defaultMensaje}
            className={cn(
              inputCls,
              "resize-y border border-neutral-400 px-3",
              errors.mensaje && "border-red-600"
            )}
            placeholder="Colores, logotipos, referencias que te gusten…"
          />
          {errors.mensaje && (
            <p className="mt-1 text-xs text-red-600">{errors.mensaje}</p>
          )}
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          No se pudo enviar. Inténtalo de nuevo o escríbenos a{" "}
          <a href="mailto:racorcycling@gmail.com" className="underline">
            racorcycling@gmail.com
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex cursor-pointer items-center gap-2.5 border border-neutral-900 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:bg-neutral-900 hover:text-white disabled:opacity-50"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Enviando…
          </>
        ) : (
          <>
            <Send className="size-4" /> Enviar mensaje
          </>
        )}
      </button>
      <p className="text-xs text-neutral-400">
        * Campos obligatorios. Usamos tus datos solo para responder a tu
        consulta.
      </p>
    </form>
  );
}
