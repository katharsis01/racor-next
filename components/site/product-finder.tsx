"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  getMaillotDecision,
  type MaillotDecision,
} from "@/lib/data/maillot-comparison";
import { cn } from "@/lib/utils";

type Temperature = "very-hot" | "warm" | "cool";
type Priority = "aero" | "ventilation" | "durability";
type Fit = "race" | "fitted" | "unsure";

const TEMPERATURES: { value: Temperature; label: string }[] = [
  { value: "very-hot", label: "Mucho calor" },
  { value: "warm", label: "Temperatura suave" },
  { value: "cool", label: "Entretiempo" },
];

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "aero", label: "Aerodinámica" },
  { value: "ventilation", label: "Ventilación" },
  { value: "durability", label: "Durabilidad" },
];

const FITS: { value: Fit; label: string }[] = [
  { value: "race", label: "Muy ajustado" },
  { value: "fitted", label: "Entallado" },
  { value: "unsure", label: "Necesito ayuda" },
];

function chooseProduct(
  temperature: Temperature,
  priority: Priority,
  fit: Fit
): MaillotDecision {
  let handle = "maillot-morcuera-oficial";

  if (temperature === "cool") handle = "maillot-manga-larga-fuenfria";
  else if (priority === "durability") handle = "maillot-canencia";
  else if (priority === "aero" || fit === "race") handle = "maillot-morcuera-2-0";
  else if (priority === "ventilation" && temperature === "very-hot") {
    handle = "maillot-morcuera-2-0";
  } else if (priority === "ventilation") handle = "maillot-navafria-oficial";

  return getMaillotDecision(handle) ?? getMaillotDecision("maillot-morcuera-2-0")!;
}

function ChoiceGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-white/55">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={cn(
              "border px-3.5 py-2.5 text-xs transition-colors",
              value === option.value
                ? "border-white bg-white text-neutral-950"
                : "border-white/25 text-white/80 hover:border-white/60"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function ProductFinder() {
  const [temperature, setTemperature] = useState<Temperature>("very-hot");
  const [priority, setPriority] = useState<Priority>("aero");
  const [fit, setFit] = useState<Fit>("race");
  const recommendation = chooseProduct(temperature, priority, fit);

  return (
    <div className="grid gap-10 bg-racor p-6 text-white md:p-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/55">
          Recomendador rápido
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-bold uppercase tracking-tight md:text-4xl">
          Encuentra tu maillot en tres decisiones
        </h2>
        <div className="mt-8 space-y-7">
          <ChoiceGroup
            legend="1. Temperatura habitual"
            options={TEMPERATURES}
            value={temperature}
            onChange={setTemperature}
          />
          <ChoiceGroup
            legend="2. Tu prioridad"
            options={PRIORITIES}
            value={priority}
            onChange={setPriority}
          />
          <ChoiceGroup legend="3. Ajuste" options={FITS} value={fit} onChange={setFit} />
        </div>
      </div>

      <div className="self-end border-t border-white/25 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-white/55">
          Nuestra recomendación
        </p>
        <h3 className="mt-3 text-3xl font-bold uppercase">{recommendation.title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-white/75">
          {recommendation.summary}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-white/20 py-5 text-xs">
          <div>
            <dt className="text-white/45">Temperatura</dt>
            <dd className="mt-1 font-semibold">{recommendation.temperature}</dd>
          </div>
          <div>
            <dt className="text-white/45">Mejor para</dt>
            <dd className="mt-1 font-semibold">{recommendation.bestFor}</dd>
          </div>
        </dl>
        <Link
          href={`/prendas/${recommendation.handle}`}
          data-analytics-event="product_finder_click"
          data-analytics-product={recommendation.handle}
          className="mt-6 inline-flex items-center gap-2 border border-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-white hover:text-racor"
        >
          Ver {recommendation.title} <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
