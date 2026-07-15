import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clapperboard, MapPin, Shirt } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { MediaNav } from "@/components/site/media-nav";
import { videos } from "@/lib/data/videos";

export const metadata: Metadata = {
  title: "Galería de vídeos",
  description:
    "Vídeos de RACOR: ropa ciclista personalizada, proyectos y producción local en Madrid.",
  alternates: { canonical: "/videos" },
};

const STORY_POINTS = [
  {
    icon: Shirt,
    title: "Diseño propio",
    description: "Equipaciones creadas alrededor de la identidad de cada ciclista, club o proyecto.",
  },
  {
    icon: MapPin,
    title: "Hecho en Madrid",
    description: "Desarrollo y producción local para controlar de cerca el acabado de cada prenda.",
  },
  {
    icon: Clapperboard,
    title: "Historias reales",
    description: "Ciclismo, comunidad y proyectos que explican la marca mejor que cualquier catálogo.",
  },
];

export default function VideosPage() {
  const featured = videos[0];

  return (
    <>
      <PageHero
        kicker="Galería de vídeos"
        title="RACOR en movimiento"
        intro="Prendas, ciclistas y proyectos reales. Una forma más directa de conocer cómo se vive RACOR dentro y fuera de la carretera."
      />
      <MediaNav active="videos" />

      <section className="px-5 pb-20 md:px-12 md:pb-28 lg:px-16">
        <article className="grid overflow-hidden bg-neutral-950 text-white lg:grid-cols-[1.45fr_0.55fr]">
          <div className="bg-black">
            <video
              controls
              playsInline
              preload="metadata"
              poster={featured.poster}
              aria-label={featured.title}
              className="aspect-video h-full w-full object-cover"
            >
              <source src={featured.src} type="video/mp4" />
              Tu navegador no puede reproducir este vídeo.
            </video>
          </div>
          <div className="flex flex-col justify-end p-6 md:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50">
              Vídeo destacado
            </p>
            <h2 className="mt-3 text-2xl font-bold uppercase tracking-tight md:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              {featured.description}
            </p>
            <Link
              href="/contacto"
              data-analytics-event="video_contact_click"
              className="mt-7 inline-flex w-fit items-center gap-2 border border-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-white hover:text-neutral-950"
            >
              Cuéntanos tu proyecto <ArrowRight className="size-4" />
            </Link>
          </div>
        </article>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50 px-5 py-20 md:px-12 md:py-24 lg:px-16">
        <div className="grid gap-10 md:grid-cols-3">
          {STORY_POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <article key={point.title} className="border-t border-neutral-900 pt-5">
                <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                <h2 className="mt-5 text-base font-semibold uppercase tracking-[0.04em]">
                  {point.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  {point.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-5 py-24 text-center md:py-36">
        <h2 className="text-3xl font-bold uppercase md:text-5xl">Tu historia puede ser la siguiente</h2>
        <Link
          href="/contacto"
          data-analytics-event="video_final_contact_click"
          className="mt-8 inline-flex items-center gap-2 border border-neutral-900 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-neutral-900 hover:text-white"
        >
          Empezar proyecto <ArrowRight className="size-4" />
        </Link>
      </section>
    </>
  );
}
