import type { Metadata } from "next";
import Link from "next/link";
import { gallery } from "@/lib/data/gallery";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { GalleryGrid } from "./gallery-grid";
import { MediaNav } from "@/components/site/media-nav";

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Galería de equipaciones ciclistas RACOR: clubes, equipos y proyectos hechos en Madrid.",
};

export default function GaleriaPage() {
  return (
    <>
      <PageHero
        title="Galería"
        intro="Equipaciones reales para clubes, equipos y proyectos. Pincha en cualquier foto para verla en grande."
      />
      <MediaNav active="photos" />
      <GalleryGrid items={gallery} />
      <Reveal className="px-5 py-24 text-center md:py-40">
        <h2 className="mb-8 text-3xl font-bold uppercase md:text-5xl">
          Tu equipo, el siguiente
        </h2>
        <Link
          href="/contacto"
          className="inline-block border border-neutral-900 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:bg-neutral-900 hover:text-white"
        >
          Empezar proyecto
        </Link>
      </Reveal>
    </>
  );
}
