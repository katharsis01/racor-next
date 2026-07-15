"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const MIN_TEMP = 0;
const MAX_TEMP = 35;
const SPAN = MAX_TEMP - MIN_TEMP;

export type TempComparatorItem = {
  handle: string;
  title: string;
  categoryLabel: string;
  tempRange: [number, number];
  estimatedRange?: boolean;
};

export function TempComparator({
  items,
  currentHandle,
  defaultTemp = 21,
}: {
  items: TempComparatorItem[];
  currentHandle?: string;
  defaultTemp?: number;
}) {
  const [temp, setTemp] = useState(defaultTemp);
  const hasEstimates = items.some((item) => item.estimatedRange);

  return (
    <div className="border border-neutral-200 bg-white p-5 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <label
          className="text-sm font-bold uppercase tracking-tight md:text-base"
          htmlFor="temp-comparator-slider"
        >
          ¿A qué temperatura sales?
        </label>
        <p className="font-mono text-sm text-neutral-500">
          <span className="text-xl font-bold text-racor">{temp}</span> ºC
        </p>
      </div>

      <input
        className="mt-4 h-1.5 w-full cursor-pointer accent-racor"
        id="temp-comparator-slider"
        max={MAX_TEMP}
        min={MIN_TEMP}
        onChange={(event) => setTemp(Number(event.target.value))}
        step={1}
        type="range"
        value={temp}
      />

      <div aria-hidden="true" className="relative mt-1 mb-4 h-5">
        {Array.from({ length: SPAN / 5 + 1 }, (_, i) => MIN_TEMP + i * 5).map(
          (mark) => (
            <span
              className="absolute -translate-x-1/2 font-mono text-[10px] text-neutral-400"
              key={mark}
              style={{ left: `${((mark - MIN_TEMP) / SPAN) * 100}%` }}
            >
              {mark}º
            </span>
          ),
        )}
      </div>

      <div className="space-y-1.5">
        {items.map((item) => {
          const [min, max] = item.tempRange;
          const hit = temp >= min && temp <= max;
          const isCurrent = item.handle === currentHandle;
          return (
            <Link
              className={cn(
                "grid grid-cols-[96px_1fr] items-center gap-3 py-0.5 transition-opacity sm:grid-cols-[150px_1fr]",
                !hit && "opacity-45",
              )}
              href={`/prendas/${item.handle}`}
              key={item.handle}
            >
              <span className="min-w-0">
                <span
                  className={cn(
                    "block truncate text-[11px] font-bold uppercase tracking-[0.04em]",
                    hit && "text-racor",
                  )}
                >
                  {item.title}
                  {item.estimatedRange && (
                    <span aria-label="rango estimado" className="text-amber-700"> ≈</span>
                  )}
                </span>
                <span className="block truncate text-[10px] text-neutral-400">
                  {item.categoryLabel}
                  {isCurrent && " · Estás aquí"}
                </span>
              </span>
              <span
                aria-label={`${item.title}: de ${min} a ${max} grados`}
                className="relative h-6 border-l border-neutral-200 bg-[linear-gradient(to_right,var(--color-neutral-200)_1px,transparent_1px)] bg-[length:calc(100%/7)_100%]"
              >
                <span
                  className={cn(
                    "absolute inset-y-1 flex items-center justify-center font-mono text-[10px] transition-colors",
                    hit ? "bg-racor text-white" : "bg-neutral-200 text-transparent",
                    isCurrent && "outline outline-2 outline-offset-1 outline-neutral-900",
                  )}
                  style={{
                    left: `${((min - MIN_TEMP) / SPAN) * 100}%`,
                    width: `${((max - min) / SPAN) * 100}%`,
                  }}
                >
                  {min}–{max}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      {hasEstimates && (
        <p className="mt-4 text-xs leading-relaxed text-neutral-400">
          <span className="text-amber-700">≈</span> Rango estimado a partir de la
          descripción publicada; confirma el rango exacto con tu propuesta.
        </p>
      )}
    </div>
  );
}

const SCORE_LABELS: { key: ScoreKey; label: string }[] = [
  { key: "ventilacion", label: "Ventilación" },
  { key: "aerodinamica", label: "Aerodinámica" },
  { key: "durabilidad", label: "Durabilidad" },
  { key: "abrigo", label: "Abrigo" },
];

type ScoreKey = "ventilacion" | "aerodinamica" | "durabilidad" | "abrigo";

export type ScoreCardItem = {
  handle: string;
  title: string;
  scores: Partial<Record<ScoreKey, number>>;
};

function Dots({ value }: { value: number }) {
  return (
    <span aria-label={`${value} de 5`} className="inline-flex gap-1" role="img">
      {[1, 2, 3, 4, 5].map((step) => (
        <span
          aria-hidden="true"
          className={cn(
            "size-2 rounded-full",
            step <= value ? "bg-racor" : "bg-neutral-200",
          )}
          key={step}
        />
      ))}
    </span>
  );
}

export function ScoreCards({
  items,
  currentHandle,
}: {
  items: ScoreCardItem[];
  currentHandle?: string;
}) {
  return (
    <div className="grid gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const isCurrent = item.handle === currentHandle;
        return (
          <Link
            className={cn(
              "group bg-white p-5 transition-colors hover:bg-neutral-50",
              isCurrent && "bg-racor/5",
            )}
            href={`/prendas/${item.handle}`}
            key={item.handle}
          >
            <p className="text-sm font-bold uppercase tracking-[0.02em]">
              {item.title}
              {isCurrent && (
                <span className="ml-2 text-[9px] uppercase tracking-[0.1em] text-racor">
                  Estás aquí
                </span>
              )}
            </p>
            <dl className="mt-3 space-y-2">
              {SCORE_LABELS.filter(({ key }) => item.scores[key] != null).map(
                ({ key, label }) => (
                  <div
                    className="flex items-center justify-between gap-3"
                    key={key}
                  >
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-400">
                      {label}
                    </dt>
                    <dd className="m-0">
                      <Dots value={item.scores[key] ?? 0} />
                    </dd>
                  </div>
                ),
              )}
            </dl>
          </Link>
        );
      })}
    </div>
  );
}
