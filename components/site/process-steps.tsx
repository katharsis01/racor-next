import { Reveal } from "@/components/site/reveal";

export type ProcessStep = {
  n: string;
  t: string;
  d: string;
  /** Dato publicado del paso (plazo, condición). Solo se muestra si existe. */
  meta?: string;
};

export function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="grid grid-cols-1 gap-x-6 gap-y-12 px-5 sm:grid-cols-2 md:px-12 lg:grid-cols-4 lg:px-16">
      {steps.map((step, i) => (
        <Reveal className="h-full" key={step.n} delay={i * 0.08}>
          <li className="group flex h-full flex-col lg:pr-8">
            <span
              aria-hidden="true"
              className="block text-[68px] leading-none font-bold tracking-tight text-transparent transition-[-webkit-text-stroke-color] duration-300 [-webkit-text-stroke:1.5px_#d4d4d4] group-hover:[-webkit-text-stroke:1.5px_#0c332c]"
            >
              {step.n}
            </span>
            <span aria-hidden="true" className="relative mt-5 block h-px bg-neutral-300">
              <span className="absolute top-1/2 left-0 size-2 -translate-y-1/2 rounded-full bg-racor transition-transform duration-300 group-hover:scale-150" />
            </span>
            <h3 className="mt-5 text-base font-semibold uppercase tracking-[0.04em]">
              {step.t}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-neutral-500">{step.d}</p>
            {step.meta && (
              <p className="mt-4 self-start border border-neutral-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em]">
                {step.meta}
              </p>
            )}
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
