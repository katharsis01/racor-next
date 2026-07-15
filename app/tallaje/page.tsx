import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHead } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { SizeGuide } from "@/components/site/size-guide";
import { MEASURE_STEPS } from "@/lib/data/sizing";

export const metadata: Metadata = {
  title: "Guía de Tallas",
  description:
    "Guía de tallas RACOR para hombre y mujer: cómo medirte, tablas de medidas y recomendador de talla. Válida para todas las prendas.",
};

export default function TallajePage() {
  return (
    <>
      <PageHero
        kicker="Guía de tallas"
        title="Acierta a la primera"
        intro="Tallaje estándar válido para cualquier prenda RACOR: maillots, manga larga, chaquetas, chalecos, culottes y monos. Mídete, consulta la tabla y, si dudas, te asesoramos."
      />

      {/* Cómo medirte */}
      <section className="pb-20 md:pb-28">
        <SectionHead
          title="Cómo medirte"
          sub="Necesitas una cinta métrica y 2 minutos. Mídete sobre ropa interior o ropa muy fina."
        />
        <ol className="grid grid-cols-1 gap-10 px-5 sm:grid-cols-2 md:px-12 lg:grid-cols-4 lg:px-16">
          {MEASURE_STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.06}>
              <li>
                <span className="mb-3.5 block text-[13px] tracking-[0.1em] text-neutral-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-2.5 border-t border-neutral-900 pt-3.5 text-base font-semibold uppercase tracking-[0.04em]">
                  {s.t}
                </h3>
                <p className="text-sm text-neutral-500">{s.d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Tabla + recomendador */}
      <section className="pb-24 md:pb-32">
        <SectionHead
          title="Tu talla"
          sub="Introduce tus medidas y la tabla marcará tu talla recomendada."
        />
        <Reveal className="px-5 md:px-12 lg:px-16">
          <div className="max-w-3xl">
            <SizeGuide />
          </div>
        </Reveal>
      </section>

      {/* Nota equipos */}
      <section className="bg-neutral-100 px-5 py-20 md:px-12 md:py-28 lg:px-16">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="mb-4 text-2xl font-bold uppercase md:text-4xl">
              ¿Pedido de equipo?
            </h2>
            <p className="mb-3 text-[15px] leading-relaxed text-neutral-600">
              Para clubes y equipos enviamos kit de tallaje: prendas de muestra
              para que cada corredor pruebe su talla antes de producir. Así el
              pedido llega perfecto a todo el equipo.
            </p>
            <p className="text-[15px] leading-relaxed text-neutral-600">
              Y si tras recibir tu prenda la talla no es la correcta, te
              asesoramos para resolverlo.
            </p>
          </div>
        </Reveal>
      </section>

      <Reveal className="px-5 py-24 text-center md:py-36">
        <h2 className="mb-8 text-3xl font-bold uppercase md:text-5xl">
          ¿Dudas con tu talla?
        </h2>
        <Link
          href="/contacto"
          className="inline-block border border-neutral-900 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:bg-neutral-900 hover:text-white"
        >
          Te asesoramos
        </Link>
      </Reveal>
    </>
  );
}
