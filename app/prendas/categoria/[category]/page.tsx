import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCommerce, type ProductCategory } from "@/lib/commerce";
import { CollectionCard } from "@/components/site/collection-card";
import { CategoryTabs } from "@/components/site/category-tabs";
import { Reveal } from "@/components/site/reveal";
import { sortProductsForDisplay } from "@/lib/commerce/catalog-order";

const CATEGORY_META: Record<
  ProductCategory,
  { title: string; sub: string }
> = {
  maillots: {
    title: "Maillots",
    sub: "Manga corta · Corte race y confort",
  },
  "manga-larga": {
    title: "Maillots manga larga",
    sub: "Entretiempo de 15 a 22 ºC",
  },
  termicos: {
    title: "Maillots manga larga térmicos",
    sub: "Protección transpirable para clima seco de 8 a 18 ºC",
  },
  chaquetas: {
    title: "Chaquetas",
    sub: "Dos niveles de protección para el invierno, desde <0 hasta 16 ºC",
  },
  chalecos: {
    title: "Chalecos",
    sub: "Cortavientos plegables y un modelo térmico para proteger el torso",
  },
  "culottes-cortos": {
    title: "Culottes cortos",
    sub: "Cuatro construcciones: color sólido, sublimadas y cargo",
  },
  "culottes-largos": {
    title: "Culottes largos",
    sub: "Dos opciones térmicas para personalizar los entrenamientos de invierno",
  },
};

export function generateStaticParams() {
  return Object.keys(CATEGORY_META).map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category as ProductCategory];
  if (!meta) return {};
  return {
    title: `${meta.title} Custom`,
    description: `${meta.title} personalizados RACOR. ${meta.sub}. Diseño exclusivo y producción en Madrid, desde 1 prenda.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = CATEGORY_META[category as ProductCategory];
  if (!meta) notFound();

  const all = await getCommerce().getProducts();
  const items = sortProductsForDisplay(
    all.filter((product) => product.category === category)
  );
  const featuredLongSleeveHandles = [
    "maillot-manga-larga-fuenfria",
    "maillot-manga-larga-cruz-verde",
  ];
  const featuredLongSleeve = featuredLongSleeveHandles
    .map((handle) => items.find((item) => item.handle === handle))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const otherLongSleeve = items.filter(
    (item) => !featuredLongSleeveHandles.includes(item.handle)
  );

  return (
    <div className="pt-24 md:pt-28">
      <div className="px-5 pb-8 md:px-12 lg:px-16">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
          Prendas custom
        </p>
        <h1 className="mt-2 text-3xl font-bold uppercase tracking-tight md:text-5xl">
          {meta.title}
        </h1>
        <p className="mt-2 text-[15px] text-neutral-500">{meta.sub}</p>
      </div>

      <CategoryTabs />

      <section className="px-5 pt-8 pb-16 md:px-12 md:pb-24 lg:px-16">
        {category === "manga-larga" ? (
          <div className="mx-auto max-w-[1500px]">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-racor">
                Dos maillots · dos niveles de abrigo
              </p>
              <h2 className="mt-3 text-2xl font-bold uppercase tracking-tight md:text-3xl">
                Elige según la temperatura
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                Fuenfría prioriza ligereza y transpirabilidad entre 18 y 22 ºC.
                Cruz Verde usa lycra semitérmica de 230 g/m² para días más
                frescos, entre 15 y 20 ºC.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-0.5 sm:grid-cols-2">
              {featuredLongSleeve.map((product, index) => (
                <CollectionCard
                  key={product.id}
                  product={product}
                  priority={index === 0}
                />
              ))}
            </div>

            {otherLongSleeve.length > 0 && (
              <div className="mt-16 border-t border-neutral-200 pt-10 md:mt-24">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
                      Más protección y equipaciones
                    </p>
                    <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight">
                      Otras prendas de manga larga
                    </h2>
                  </div>
                  <p className="text-sm text-neutral-500">
                    {otherLongSleeve.length} opciones adicionales
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
                  {otherLongSleeve.map((product) => (
                    <CollectionCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-neutral-500">
              {items.length} {items.length === 1 ? "prenda" : "prendas"}
            </p>
            <div
              className={`grid grid-cols-1 gap-0.5 sm:grid-cols-2 ${
                items.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-4"
              }`}
            >
              {items.map((product, index) => (
                <CollectionCard
                  key={product.id}
                  product={product}
                  priority={index === 0}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <Reveal className="px-5 pb-24 text-center md:pb-40">
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
    </div>
  );
}
