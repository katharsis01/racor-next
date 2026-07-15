import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero, SectionHead } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { GalleryGrid } from "@/app/galeria/gallery-grid";
import { SOLIDARITY_PROJECTS } from "@/lib/social";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce RACOR y cómo creamos ropa ciclista custom en Madrid: desarrollo local, sostenibilidad, diseño y producción desde una sola prenda.",
};

const PILLARS = [
  {
    t: "Desarrollo local",
    d: "Producción íntegra en Madrid. Cada prenda genera valor en nuestra ciudad y nos permite controlar la calidad de cerca.",
  },
  {
    t: "Sostenibilidad",
    d: "Tejidos nacionales, producción bajo demanda y sin stock sobrante. Fabricamos lo que se va a usar.",
  },
  {
    t: "Excelencia",
    d: "Tejidos técnicos de primer nivel y controles exhaustivos, prenda a prenda, antes de cada entrega.",
  },
];

const PROCESS_STEPS = [
  {
    n: "01",
    t: "Tu sueño",
    d: "Coméntanos tu idea: colores, gustos, imágenes y logotipos que te gustaría incluir. Escuchamos antes de dibujar.",
  },
  {
    n: "02",
    t: "Selección",
    d: "Elige el tipo de prendas, las cantidades y las tallas que necesitas. Te asesoramos con el tallaje de todo el equipo.",
  },
  {
    n: "03",
    t: "Diseño",
    d: "Nuestros diseñadores trabajan con tu idea y te presentan propuestas exclusivas hasta tu aprobación definitiva.",
  },
  {
    n: "04",
    t: "Producción",
    d: "El diseño definitivo pasa a fabricación bajo nuestros exhaustivos controles de calidad, prenda a prenda.",
  },
];

const PROCESS_INFO = [
  {
    t: "Pedido mínimo",
    d: "No hay. Desde 1 prenda en adelante, con las mismas calidades y personalización.",
  },
  {
    t: "Plazo de entrega",
    d: "4 semanas aproximadas (30 días) desde la aprobación definitiva del diseño.",
  },
  {
    t: "Diseño incluido",
    d: "Nuestros diseñadores desarrollan tu equipación contigo, sin coste adicional.",
  },
  {
    t: "Pago",
    d: "50% de anticipo y 50% antes de la entrega, mediante transferencia bancaria.",
  },
  {
    t: "Tallaje",
    d: "Guía de tallas y asesoramiento personalizado para acertar a la primera.",
  },
  {
    t: "Dónde estamos",
    d: "Madrid ciudad. Lun–Vie de 9:00 a 14:00 y de 15:00 a 18:00.",
  },
];

const PROJECT_IMAGES = [
  { src: "/assets/racor/proj-1309.webp", caption: "1309 Razones · Madrid–París" },
  { src: "/assets/racor/parkinson.webp", caption: "Con P de Parkinson" },
  { src: "/assets/racor/fundacion-levante.webp", caption: "Fundación Levante" },
];

export default function NosotrosPage() {
  return (
    <>
      <PageHero
        kicker="Nosotros"
        title={
          <>
            Ropa ciclista custom
            <br />
            hecha en Madrid
          </>
        }
        intro="RACOR nace para ir más allá de la ropa ciclista personalizada: una marca auténtica, arraigada en Madrid y comprometida con la comunidad ciclista madrileña."
      />

      <section className="mb-24 grid grid-cols-1 gap-0.5 md:grid-cols-2">
        <div className="relative aspect-[4/3] bg-neutral-100 md:aspect-auto">
          <Image
            src="/assets/racor/cotor.webp"
            alt="Ciclista RACOR con maillot Cotor"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <Reveal className="flex flex-col justify-center bg-neutral-100 p-8 md:p-16 lg:p-20">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Nuestra esencia
          </p>
          <h2 className="mb-5 text-2xl font-bold uppercase md:text-4xl">
            Auténtica, local y técnica
          </h2>
          <p className="mb-3 text-[15px] leading-relaxed text-neutral-500">
            Diseñamos, desarrollamos y confeccionamos en Madrid con materiales y tejidos
            nacionales. Así mantenemos el control de todo el proceso y cuidamos la calidad
            de cada prenda.
          </p>
          <p className="mb-3 text-[15px] leading-relaxed text-neutral-500">
            Apostar por una producción cercana impulsa la industria y el empleo local,
            reduce desplazamientos y limita el impacto ambiental de cada equipación.
          </p>
          <p className="text-[15px] leading-relaxed text-neutral-500">
            Como marca joven y dinámica, creamos prendas técnicas premium, duraderas y con
            una estética propia. Funcionalidad, diseño y estilo para rodar con identidad.
          </p>
        </Reveal>
      </section>

      <section className="pb-24">
        <SectionHead title="Tres pilares" />
        <div className="grid grid-cols-1 gap-10 px-5 sm:grid-cols-2 md:px-12 lg:grid-cols-3 lg:px-16">
          {PILLARS.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.08}>
              <div className="border-t border-neutral-900 pt-4">
                <h3 className="mb-2.5 text-base font-semibold uppercase tracking-[0.04em]">
                  {p.t}
                </h3>
                <p className="text-sm text-neutral-500">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        id="proceso"
        className="scroll-mt-24 border-t border-neutral-200 py-24 md:py-32"
      >
        <SectionHead
          title="Cómo trabajamos"
          sub="De tu idea a la carretera: un proceso claro, cercano y sin pedido mínimo."
        />
        <ol className="grid grid-cols-1 gap-10 px-5 sm:grid-cols-2 md:px-12 lg:grid-cols-4 lg:px-16">
          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08}>
              <li>
                <span className="mb-3.5 block text-[13px] tracking-[0.1em] text-neutral-500">
                  {step.n}
                </span>
                <h3 className="mb-2.5 border-t border-neutral-900 pt-3.5 text-base font-semibold uppercase tracking-[0.04em]">
                  {step.t}
                </h3>
                <p className="text-sm text-neutral-500">{step.d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="relative flex h-[70vh] min-h-[420px] items-center justify-center overflow-hidden">
        <Image
          src="/assets/racor/morcuera.webp"
          alt="Ciclista con equipación RACOR producida en Madrid"
          fill
          sizes="100vw"
          className="object-cover object-[center_25%]"
        />
        <div className="absolute inset-0 bg-black/35" />
        <Reveal className="relative z-10 px-5 text-center text-white">
          <h2 className="text-3xl leading-[1.08] font-bold uppercase md:text-5xl lg:text-[56px]">
            Producción local.
            <br />
            Control total.
          </h2>
        </Reveal>
      </section>

      <section id="condiciones" className="scroll-mt-24 py-24 md:py-32">
        <SectionHead title="Lo importante" sub="Condiciones claras desde el primer día." />
        <div className="grid grid-cols-1 gap-10 px-5 sm:grid-cols-2 md:px-12 lg:grid-cols-3 lg:px-16">
          {PROCESS_INFO.map((item, i) => (
            <Reveal key={item.t} delay={i * 0.05}>
              <div className="border-t border-neutral-900 pt-4">
                <h3 className="mb-2.5 text-[13px] font-semibold uppercase tracking-[0.1em]">
                  {item.t}
                </h3>
                <p className="text-sm text-neutral-500">{item.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16 px-5 text-center md:px-12 lg:px-16">
          <Link
            href="/contacto"
            className="inline-block border border-neutral-900 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:bg-neutral-900 hover:text-white"
          >
            Empezar con mi idea
          </Link>
        </Reveal>
      </section>

      <section id="proyectos" className="bg-neutral-100 py-24 md:py-32">
        <SectionHead title="Proyectos solidarios" sub="Pedaladas con propósito." />
        <GalleryGrid items={PROJECT_IMAGES} />
        <div className="mx-5 border-t border-neutral-900/15 md:mx-12 lg:mx-16">
          {SOLIDARITY_PROJECTS.map((project) => (
            <Reveal key={project.href}>
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between border-b border-neutral-900/15 py-6 transition-[padding] hover:pl-3"
              >
                <span className="text-base font-semibold uppercase tracking-[0.02em] md:text-xl">
                  {project.title}
                </span>
                <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal className="px-5 py-28 text-center md:py-40">
        <h2 className="mb-8 text-3xl font-bold uppercase md:text-5xl">Rueda con nosotros</h2>
        <Link
          href="/contacto"
          className="inline-block border border-neutral-900 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:bg-neutral-900 hover:text-white"
        >
          Contactar
        </Link>
      </Reveal>
    </>
  );
}
