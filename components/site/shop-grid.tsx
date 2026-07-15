"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

const SHOP_BASE = "https://www.racorsport.es/tienda9a174805";
const IMG = "/assets/tienda";

const COLLECTIONS = [
  {
    title: "Ciclismo en Cadena",
    slug: "col-ciclismo-en-cadena",
    href: `${SHOP_BASE}/CICLISMO-EN-CADENA-10-TEMPORADAS-JUNTOS-c178703399`,
  },
  {
    title: "Puertos de Madrid",
    slug: "col-puertos-de-madrid",
    href: `${SHOP_BASE}/PUERTOS-DE-MADRID-c164779790`,
  },
  {
    title: "RACOR Colección",
    slug: "col-racor-coleccion",
    href: `${SHOP_BASE}/RACOR-COLECCION-c159567533`,
  },
  {
    title: "Serie Clásicas del Ciclismo",
    slug: "col-serie-clasicas",
    href: `${SHOP_BASE}/SERIE-CLASICAS-DEL-CICLISMO-c179192001`,
  },
];

type ShopItem = {
  title: string;
  slug: string;
  href: string;
  price: number;
  offer?: boolean;
  category: string;
};

const SHOP_SECTIONS: { title: string; sub: string; items: ShopItem[] }[] = [
  {
    title: "Maillots",
    sub: "Colección RACOR de temporada",
    items: [
      {
        title: "Maillot Morcuera 2.0",
        slug: "maillot-morcuera-2-0",
        href: `${SHOP_BASE}/MAILLOT-MORCUERA-2-0-p797060443`,
        price: 75,
        category: "Maillots",
      },
      {
        title: "Maillot Morcuera 2.0 — Giro d'Lavanda",
        slug: "maillot-morcuera-2-0-giro-dlavanda",
        href: `${SHOP_BASE}/MAILLOT-MORCUERA-2-0-GIRO-DLAVANDA-p758137636`,
        price: 75,
        category: "Maillots",
      },
      {
        title: "Maillot Morcuera — Blanco",
        slug: "maillot-morcuera-racor-blanco",
        href: `${SHOP_BASE}/MAILLOT-MORCUERA-RACOR-BLANCO-p650628241`,
        price: 75,
        category: "Maillots",
      },
      {
        title: "Maillot Morcuera — Negro",
        slug: "maillot-morcuera-racor-negro",
        href: `${SHOP_BASE}/MAILLOT-MORCUERA-RACOR-NEGRO-p650644723`,
        price: 75,
        category: "Maillots",
      },
      {
        title: "Maillot Morcuera — Rojo",
        slug: "maillot-morcuera-racor-rojo",
        href: `${SHOP_BASE}/MAILLOT-MORCUERA-RACOR-ROJO-p700312111`,
        price: 75,
        category: "Maillots",
      },
      {
        title: "Maillot Morcuera — Azul",
        slug: "maillot-morcuera-racor-azul",
        href: `${SHOP_BASE}/MAILLOT-MORCUERA-RACOR-AZUL-p700312946`,
        price: 75,
        category: "Maillots",
      },
      {
        title: "Maillot Morcuera — Verde",
        slug: "maillot-morcuera-racor-verde",
        href: `${SHOP_BASE}/MAILLOT-MORCUERA-RACOR-VERDE-p700312115`,
        price: 75,
        category: "Maillots",
      },
    ],
  },
  {
    title: "Culottes y chalecos",
    sub: "Complemento perfecto para tu maillot",
    items: [
      {
        title: "Culotte corto Puebla",
        slug: "culotte-corto-puebla-racor",
        href: `${SHOP_BASE}/CULOTTE-CORTO-PUEBLA-RACOR-p604736500`,
        price: 110,
        category: "Culottes y chalecos",
      },
      {
        title: "Chaleco cortaviento Miraflores II",
        slug: "chaleco-cortaviento-miraflores-racor-ii",
        href: `${SHOP_BASE}/CHALECO-CORTAVIENTO-MIRAFLORES-RACOR-II-p604927056`,
        price: 59,
        category: "Culottes y chalecos",
      },
    ],
  },
  {
    title: "Camisetas",
    sub: "Ed. Puertos de Madrid",
    items: [
      {
        title: "Camiseta Puerto de la Morcuera",
        slug: "camiseta-puerto-de-la-morcuera-ed-puertos-de-madrid",
        href: `${SHOP_BASE}/CAMISETA-PUERTO-DE-LA-MORCUERA-ED-PUERTOS-DE-MADRID-p657754992`,
        price: 20,
        category: "Camisetas",
      },
      {
        title: "Camiseta Puerto de Canencia",
        slug: "camiseta-puerto-de-canencia-ed-puertos-de-madrid",
        href: `${SHOP_BASE}/CAMISETA-PUERTO-DE-CANENCIA-ED-PUERTOS-DE-MADRID-p657718708`,
        price: 20,
        category: "Camisetas",
      },
      {
        title: "Camiseta Puerto de la Puebla",
        slug: "camiseta-puerto-de-la-puebla-ed-puertos-de-madrid",
        href: `${SHOP_BASE}/CAMISETA-PUERTO-DE-LA-PUEBLA-ED-PUERTOS-DE-MADRID-p657715725`,
        price: 20,
        category: "Camisetas",
      },
    ],
  },
  {
    title: "Accesorios",
    sub: "Calcetines y guantes RACOR",
    items: [
      {
        title: "Calcetines Aero — Blanco",
        slug: "calcetines-aero-racor-blanco",
        href: `${SHOP_BASE}/CALCETINES-AERO-RACOR-BLANCO-p650628248`,
        price: 25,
        category: "Accesorios",
      },
      {
        title: "Calcetines Hilo — Blanco",
        slug: "calcetines-hilo-racor-blanco",
        href: `${SHOP_BASE}/CALCETINES-HILO-RACOR-BLANCO-p825668379`,
        price: 15,
        offer: true,
        category: "Accesorios",
      },
      {
        title: "Guantes cortos — Negro",
        slug: "guantes-cortos-racor-negro",
        href: `${SHOP_BASE}/GUANTES-CORTOS-RACOR-NEGRO-p777085114`,
        price: 20,
        offer: true,
        category: "Accesorios",
      },
    ],
  },
  {
    title: "Eventos",
    sub: "Participaciones 2026",
    items: [
      {
        title: "Participación — Giro d'Lavanda 2026",
        slug: "participacion-giro-dlavanda-2026",
        href: `${SHOP_BASE}/PARTICIPACION-GIRO-DLAVANDA-2026-p752767823`,
        price: 15,
        category: "Eventos",
      },
      {
        title: "Participación — Paraíso Gravel 2026",
        slug: "participacion-paraiso-gravel-2026",
        href: `${SHOP_BASE}/PARTICIPACION-PARAISO-GRAVEL-2026-p758334762`,
        price: 15,
        category: "Eventos",
      },
    ],
  },
];

const allProducts = SHOP_SECTIONS.flatMap((s) => s.items);
const categories = ["Todo", ...SHOP_SECTIONS.map((s) => s.title)];

function formatPrice(n: number) {
  return `${n.toFixed(2).replace(".00", ".00")} €`;
}

function ShopCard({ item }: { item: ShopItem }) {
  return (
    <Link
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={`${IMG}/${item.slug}.jpg`}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {item.offer && (
          <span className="absolute top-3 left-3 bg-neutral-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            En oferta
          </span>
        )}
      </div>
      <div className="flex flex-col justify-between flex-1 border-t border-neutral-100 bg-white p-3 min-h-[5.5rem]">
        <p className="text-[13px] font-semibold uppercase leading-tight tracking-[0.04em] line-clamp-2">
          {item.title}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-neutral-900">{formatPrice(item.price)}</span>
          <span className="inline-flex items-center gap-1 bg-neutral-900 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white transition-colors group-hover:bg-neutral-700">
            Comprar <ArrowUpRight className="size-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ShopGrid() {
  const [active, setActive] = useState("Todo");

  const filtered = useMemo(() => {
    if (active === "Todo") return allProducts;
    return allProducts.filter((p) => p.category === active);
  }, [active]);

  return (
    <>
      {/* Leyenda de colecciones */}
      <section className="px-5 md:px-12 lg:px-16">
        <Reveal className="mb-6 border-t border-neutral-900 pt-4">
          <h2 className="text-xl font-bold uppercase md:text-3xl">Colecciones</h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.slug}
              href={col.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-[4/3] overflow-hidden bg-neutral-100"
            >
              <Image
                src={`${IMG}/${col.slug}.jpg`}
                alt={col.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </Link>
          ))}
        </div>
      </section>

      {/* Productos */}
      <section className="px-5 md:px-12 lg:px-16">
        <Reveal className="mb-6 border-t border-neutral-900 pt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-xl font-bold uppercase md:text-3xl">Productos</h2>
            <p className="text-sm text-neutral-500">
              {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
            </p>
          </div>
        </Reveal>

        {/* Filtros */}
        <div className="sticky top-[54px] z-40 -mx-5 mb-8 border-y border-neutral-200 bg-white/95 px-5 backdrop-blur md:-mx-12 md:px-12 lg:-mx-16 lg:px-16">
          <div className="scrollbar-none flex gap-1 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={cn(
                  "shrink-0 border-b-2 px-4 py-3.5 text-xs font-medium uppercase tracking-[0.1em] transition-colors",
                  active === cat
                    ? "border-neutral-900 text-neutral-900"
                    : "border-transparent text-neutral-500 hover:text-neutral-900"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-neutral-100 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((item) => (
            <ShopCard key={item.slug} item={item} />
          ))}
        </div>
      </section>
    </>
  );
}
