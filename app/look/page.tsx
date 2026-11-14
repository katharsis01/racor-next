import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { LookBlock, type Look } from "@/components/site/shop-the-look";

export const metadata: Metadata = {
  title: "Consigue el look",
  description:
    "Equipaciones RACOR completas: toca las prendas de cada foto y monta tu look. Maillot y culotte personalizables con tus colores desde 1 unidad.",
};

const LOOKS: Look[] = [
  {
    name: "Look Navafría",
    description:
      "Rojo intenso con culotte azul marino: el kit de verano más reconocible de RACOR, con las mangas de rejilla del Navafría.",
    image: {
      src: "/assets/racor/navafria-1.webp",
      alt: "Ciclista RACOR con el look Navafría completo: maillot rojo y culotte azul marino",
    },
    items: [
      {
        handle: "maillot-navafria-oficial",
        title: "Maillot Navafría",
        category: "Maillot",
        note: "Mangas de rejilla y ventilación alta para días calurosos.",
        x: 53,
        y: 42,
      },
      {
        handle: "culotte-puebla",
        title: "Culotte Puebla",
        category: "Culotte corto",
        note: "Color sólido con tres acabados de pierna a elegir.",
        x: 55,
        y: 78,
      },
    ],
  },
  {
    name: "Look Morcuera 2.0",
    description:
      "Sublimación total en degradado: el maillot más avanzado de la casa, pensado para el calor intenso y el máximo rendimiento.",
    image: {
      src: "/assets/racor/morcuera2-detalle.jpeg",
      alt: "Ciclista rodando con el maillot Morcuera 2.0 degradado y culotte negro RACOR",
    },
    items: [
      {
        handle: "maillot-morcuera-2-0",
        title: "Maillot Morcuera 2.0",
        category: "Maillot",
        note: "Sublimación sin límites: degradados, logos y diseño a tu manera.",
        x: 45,
        y: 36,
      },
      {
        handle: "culotte-puebla",
        title: "Culotte Puebla",
        category: "Culotte corto",
        note: "Color sólido — aquí en negro — con tu logo en la pierna.",
        x: 70,
        y: 62,
      },
    ],
  },
];

export default function LookPage() {
  return (
    <>
      <PageHero
        kicker="Consigue el look"
        title={
          <>
            Equipaciones completas,
            <br />
            listas para hacer tuyas
          </>
        }
        intro="Toca los puntos de cada foto para descubrir las prendas del kit. Cada look se personaliza con tus colores y tu logo, desde 1 unidad."
      />

      <div className="space-y-16 px-5 pb-20 md:space-y-24 md:px-12 md:pb-28 lg:px-16">
        {LOOKS.map((look, index) => (
          <Reveal key={look.name}>
            <LookBlock look={look} reverse={index % 2 === 1} />
          </Reveal>
        ))}
      </div>

      <Reveal className="px-5 pb-24 text-center md:pb-40">
        <h2 className="mb-8 text-3xl font-bold uppercase md:text-5xl">
          ¿Tu look con los colores
          <br />
          de tu club?
        </h2>
        <Link
          href="/contacto"
          className="inline-block border border-neutral-900 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:bg-neutral-900 hover:text-white"
        >
          Cuéntanos tu idea
        </Link>
      </Reveal>
    </>
  );
}
