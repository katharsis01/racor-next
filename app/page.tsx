import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { maillotsOficiales } from "@/lib/commerce/local";
import { CollectionCard } from "@/components/site/collection-card";
import { Reveal } from "@/components/site/reveal";
import { SectionHead } from "@/components/site/page-hero";
import { InstagramShowcase } from "@/components/site/instagram-showcase";

const STEPS = [
  {
    n: "01",
    t: "Tu sueño",
    d: "Cuéntanos tu idea: colores, gustos, imágenes y logotipos que quieras incluir.",
  },
  {
    n: "02",
    t: "Selección",
    d: "Elige el tipo de prendas, las cantidades y las tallas que necesitas.",
  },
  {
    n: "03",
    t: "Diseño",
    d: "Nuestro equipo creativo te presenta propuestas hasta dar con la equipación perfecta.",
  },
  {
    n: "04",
    t: "Producción",
    d: "El diseño definitivo pasa a fabricación en Madrid bajo exhaustivos controles de calidad.",
  },
];

const PROJECTS = [
  "CARGO CORP · Race Across America",
  "Con P de Parkinson",
  "1309 Razones · Madrid–París",
];

export default function HomePage() {
  const featured = maillotsOficiales;

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-svh min-h-[560px] items-end overflow-hidden">
        <Image
          src="/assets/racor/navafria-1.webp"
          alt="Maillot Navafría rojo RACOR"
          fill
          priority
          sizes="100vw"
          className="scale-[1.02] object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45" />
        <div className="relative z-10 px-5 pb-14 text-white md:px-12 md:pb-24 lg:px-16">
          <p className="mb-4 text-xs uppercase tracking-[0.18em] opacity-90">
            Ropa ciclista custom · Hecha en Madrid
          </p>
          <h1 className="mb-8 text-5xl leading-[1.02] font-bold tracking-tight uppercase md:text-7xl lg:text-[88px]">
            Colección
            <br />
            Sierra de Madrid
          </h1>
          <Link
            href="/prendas"
            className="inline-block border border-current px-8 py-3.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:bg-white hover:text-neutral-900"
          >
            Descubrir colección
          </Link>
        </div>
      </section>

      {/* Manifiesto */}
      <Reveal className="flex justify-center px-5 py-24 md:py-36">
        <p className="max-w-3xl text-center text-xl leading-snug md:text-3xl">
          Celebramos el espíritu ciclista de Madrid con prendas premium. Diseño
          propio, producción local y tejidos técnicos de primer nivel para
          ciclistas que exigen algo más que un maillot.
        </p>
      </Reveal>

      {/* Colección destacada: maillots oficiales */}
      <section className="pb-20 md:pb-28">
        <SectionHead
          title="Maillots"
          sub="Nuestros modelos, cada uno con el nombre de un puerto de la sierra."
        />
        <div className="grid grid-cols-1 gap-0.5 px-5 sm:grid-cols-2 md:px-12 lg:px-16">
          {featured.map((p) => (
            <CollectionCard key={p.id} product={p} sizes="(max-width: 640px) 100vw, 50vw" />
          ))}
        </div>
        <div className="mt-10 px-5 md:px-12 lg:px-16">
          <Link
            href="/prendas"
            className="inline-block border border-neutral-900 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:bg-neutral-900 hover:text-white"
          >
            Ver todas las prendas
          </Link>
        </div>
      </section>

      {/* Banner */}
      <section className="relative flex h-[80vh] min-h-[460px] items-center justify-center overflow-hidden">
        <Image
          src="/assets/racor/navafria-2.webp"
          alt="Ciclista RACOR"
          fill
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-black/35" />
        <Reveal className="relative z-10 px-5 text-center text-white">
          <h2 className="mb-7 text-3xl leading-[1.08] font-bold uppercase md:text-5xl lg:text-[56px]">
            Diseñado para rodar.
            <br />
            Hecho para durar.
          </h2>
          <Link
            href="/nosotros#proceso"
            className="inline-block border border-current px-8 py-3.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:bg-white hover:text-neutral-900"
          >
            Cómo trabajamos
          </Link>
        </Reveal>
      </section>

      {/* Proceso */}
      <section className="py-24 md:py-36">
        <SectionHead title="El Proceso" sub="Equipaciones personalizadas en cuatro pasos." />
        <ol className="grid grid-cols-1 gap-10 px-5 sm:grid-cols-2 md:px-12 lg:grid-cols-4 lg:px-16">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <li>
                <span className="mb-3.5 block text-[13px] tracking-[0.1em] text-neutral-500">
                  {s.n}
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

      {/* Proyectos */}
      <section className="bg-neutral-100 py-24 md:py-36">
        <SectionHead title="Proyectos" sub="Pedaladas con propósito." />
        <div className="mx-5 border-t border-neutral-900/15 md:mx-12 lg:mx-16">
          {PROJECTS.map((name) => (
            <Reveal key={name}>
              <Link
                href="/nosotros#proyectos"
                className="group flex items-center justify-between border-b border-neutral-900/15 py-6 transition-[padding] hover:pl-3"
              >
                <span className="text-base font-semibold uppercase tracking-[0.02em] md:text-xl">
                  {name}
                </span>
                <ArrowRight className="size-5 shrink-0" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <Reveal className="px-5 py-28 text-center md:py-44">
        <h2 className="mb-8 text-3xl font-bold uppercase md:text-5xl lg:text-[56px]">
          ¿Montamos tu equipación?
        </h2>
        <Link
          href="/contacto"
          className="inline-block border border-neutral-900 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:bg-neutral-900 hover:text-white"
        >
          Escríbenos
        </Link>
      </Reveal>

      <InstagramShowcase />
    </>
  );
}
