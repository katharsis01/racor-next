import type { Metadata } from "next";
import Link from "next/link";
import { getCommerce, type ProductCategory } from "@/lib/commerce";
import { getTempComparatorItems } from "@/lib/commerce/guide";
import { CollectionCard } from "@/components/site/collection-card";
import { CategoryTabs } from "@/components/site/category-tabs";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { TempComparator } from "@/components/site/temp-comparator";
import { sortProductsForDisplay } from "@/lib/commerce/catalog-order";

export const metadata: Metadata = {
  title: "Prendas Custom",
  description:
    "Maillots, chaquetas, chalecos y culottes personalizados RACOR. Diseño exclusivo y producción en Madrid, desde 1 prenda.",
};

const CATEGORIES: { id: ProductCategory; title: string; sub: string }[] = [
  { id: "maillots", title: "Maillots", sub: "Manga corta · Corte race y confort" },
  { id: "manga-larga", title: "Maillots manga larga", sub: "Entretiempo · 15–22 ºC" },
  {
    id: "termicos",
    title: "Maillots térmicos",
    sub: "Clima seco · 8–18 ºC",
  },
  {
    id: "chaquetas",
    title: "Chaquetas",
    sub: "Protección de invierno · <0–16 ºC",
  },
  {
    id: "chalecos",
    title: "Chalecos",
    sub: "Cortavientos plegables y protección térmica",
  },
  {
    id: "culottes-cortos",
    title: "Culottes cortos",
    sub: "Color sólido, sublimados y cargo",
  },
  {
    id: "culottes-largos",
    title: "Culottes largos",
    sub: "Protección térmica para los días de invierno",
  },
];

export default async function PrendasPage() {
  const all = await getCommerce().getProducts();

  return (
    <>
      <PageHero
        kicker="Prendas custom"
        title={
          <>
            Tu equipación,
            <br />a tu manera
          </>
        }
        intro="Todas nuestras prendas se personalizan desde 1 unidad, sin pedido mínimo. Diseñadas, desarrolladas y confeccionadas en Madrid con tejidos técnicos nacionales."
      />

      <div className="mb-10 md:mb-14">
        <CategoryTabs />
      </div>

      <section className="mb-16 px-5 md:mb-24 md:px-12 lg:px-16">
        <Reveal className="mb-6 border-t border-neutral-900 pt-4">
          <h2 className="text-xl font-bold uppercase md:text-3xl">
            Elige por temperatura
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-neutral-500">
            Mueve el cursor y descubre al instante qué prendas cubren tus
            salidas habituales.
          </p>
        </Reveal>
        <Reveal>
          <TempComparator items={getTempComparatorItems()} />
        </Reveal>
      </section>

      {CATEGORIES.map((cat) => {
        const items = sortProductsForDisplay(
          all.filter((product) => product.category === cat.id)
        );
        return (
          <section key={cat.id} className="mb-16 px-5 md:mb-24 md:px-12 lg:px-16">
            <Reveal className="mb-6 flex flex-wrap items-baseline justify-between gap-4 border-t border-neutral-900 pt-4">
              <h2 className="text-xl font-bold uppercase md:text-3xl">{cat.title}</h2>
              <div className="flex items-baseline gap-6">
                <p className="text-sm text-neutral-500">{cat.sub}</p>
                <Link
                  href={`/prendas/categoria/${cat.id}`}
                  className="text-xs font-medium uppercase tracking-[0.1em] underline underline-offset-4 hover:opacity-60"
                >
                  Ver todo
                </Link>
              </div>
            </Reveal>
            <div
              className={`grid grid-cols-1 gap-0.5 sm:grid-cols-2 ${
                items.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-4"
              }`}
            >
              {items.map((p, index) => (
                <CollectionCard
                  key={p.id}
                  product={p}
                  priority={cat.id === "maillots" && index === 0}
                />
              ))}
            </div>
          </section>
        );
      })}

      <Reveal className="px-5 py-24 text-center md:py-40">
        <h2 className="mb-8 text-3xl font-bold uppercase md:text-5xl">
          ¿No ves tu prenda?
          <br />
          La hacemos.
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
