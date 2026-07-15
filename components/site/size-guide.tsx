"use client";

import { useMemo, useState } from "react";
import { Ruler } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FIT_NOTES,
  recommendSize,
  SIZES,
  type Gender,
} from "@/lib/data/sizing";
import { cn } from "@/lib/utils";

/* ---------- Tabla + recomendador (se usa inline en /tallaje y en el modal) ---------- */

export function SizeGuide({ compact = false }: { compact?: boolean }) {
  const [gender, setGender] = useState<Gender>("hombre");
  const [pecho, setPecho] = useState("");
  const [altura, setAltura] = useState("");

  const recommended = useMemo(() => {
    const p = Number(pecho);
    if (!p || p < 60 || p > 150) return [];
    const a = Number(altura);
    return recommendSize(gender, p, a >= 140 && a <= 210 ? a : undefined);
  }, [gender, pecho, altura]);

  const rows = SIZES[gender];
  const hasCadera = rows.some((r) => r.cadera);

  return (
    <div>
      {/* Selector hombre/mujer */}
      <div className="mb-6 flex border border-neutral-900">
        {(["hombre", "mujer"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGender(g)}
            className={cn(
              "flex-1 px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] transition-colors",
              gender === g
                ? "bg-neutral-900 text-white"
                : "bg-white text-neutral-900 hover:bg-neutral-100"
            )}
            aria-pressed={gender === g}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Recomendador */}
      <div
        className={cn(
          "mb-8 grid gap-4 border border-neutral-200 bg-neutral-50 p-5",
          compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"
        )}
      >
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500">
            Pecho (cm)
          </span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="p. ej. 96"
            value={pecho}
            onChange={(e) => setPecho(e.target.value)}
            className="w-full border-b border-neutral-400 bg-transparent py-2 text-sm outline-none focus:border-neutral-900"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500">
            Altura (cm)
          </span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="p. ej. 178"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            className="w-full border-b border-neutral-400 bg-transparent py-2 text-sm outline-none focus:border-neutral-900"
          />
        </label>
        <div className={cn("flex items-end", compact && "sm:col-span-2")}>
          <p className="text-sm" aria-live="polite">
            {recommended.length > 0 ? (
              <>
                Tu talla:{" "}
                <span className="font-bold uppercase">
                  {recommended.join(" o ")}
                </span>
              </>
            ) : (
              <span className="text-neutral-400">
                Introduce tu contorno de pecho
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-900 text-left">
              <th className="py-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em]">
                Talla
              </th>
              <th className="py-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em]">
                Altura (cm)
              </th>
              <th className="py-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em]">
                Pecho (cm)
              </th>
              <th className="py-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em]">
                Cintura (cm)
              </th>
              {hasCadera && (
                <th className="py-3 text-[11px] font-semibold uppercase tracking-[0.12em]">
                  Cadera (cm)
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const hit = recommended.includes(r.size);
              return (
                <tr
                  key={r.size}
                  className={cn(
                    "border-b border-neutral-200 transition-colors",
                    hit && "bg-neutral-900 text-white"
                  )}
                >
                  <td className="py-3 pr-4 font-bold">{r.size}</td>
                  <td className="py-3 pr-4">{r.altura[0]}–{r.altura[1]}</td>
                  <td className="py-3 pr-4">{r.pecho[0]}–{r.pecho[1]}</td>
                  <td className="py-3 pr-4">{r.cintura[0]}–{r.cintura[1]}</td>
                  {hasCadera && (
                    <td className="py-3">
                      {r.cadera ? `${r.cadera[0]}–${r.cadera[1]}` : "—"}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cortes */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {FIT_NOTES.map((f) => (
          <div key={f.t} className="border-t border-neutral-900 pt-3.5">
            <h4 className="mb-1.5 text-[13px] font-semibold uppercase tracking-[0.1em]">
              {f.t}
            </h4>
            <p className="text-sm text-neutral-500">{f.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Modal por producto (estilo Gobik) ---------- */

export function SizeGuideDialog({ productTitle }: { productTitle: string }) {
  return (
    <Dialog>
      <DialogTrigger className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline">
        <Ruler className="size-3.5" />
        Guía de tallas
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] gap-0 overflow-y-auto rounded-none p-6 sm:max-w-2xl md:p-8">
        <DialogTitle className="mb-1 text-lg font-bold uppercase tracking-tight">
          Guía de tallas
        </DialogTitle>
        <p className="mb-6 text-sm text-neutral-500">
          {productTitle} · Tallaje estándar válido para cualquier prenda RACOR.
        </p>
        <SizeGuide compact />
      </DialogContent>
    </Dialog>
  );
}
