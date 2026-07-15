import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  Clock3,
  Feather,
  Gem,
  MessageCircle,
  PackageCheck,
  Palette,
  Thermometer,
  Waves,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  getProductByHandle,
  getSimilarProducts,
  products,
} from "@/lib/commerce/local";
import type { Product } from "@/lib/commerce/types";
import { SizeGuideDialog } from "@/components/site/size-guide";
import { ProductGallery } from "@/components/site/product-gallery";
import { ProductFinder } from "@/components/site/product-finder";
import { AssistantLauncher } from "@/components/site/assistant-launcher";
import {
  getAccessoryDecision,
  getColdWeatherDecision,
  getLongSleeveDecision,
  getMaillotDecision,
  LONG_BIB_COMPARISON,
  SHORT_BIB_COMPARISON,
  VEST_COMPARISON,
} from "@/lib/data/maillot-comparison";
import {
  getScoreCardItems,
  getTempComparatorItems,
} from "@/lib/commerce/guide";
import {
  ScoreCards,
  TempComparator,
} from "@/components/site/temp-comparator";
import { absoluteUrl } from "@/lib/site";

const CATEGORY_LABEL: Record<string, string> = {
  maillots: "Maillot",
  "manga-larga": "Maillot manga larga",
  termicos: "Maillot manga larga térmico",
  chaquetas: "Chaqueta",
  chalecos: "Chaleco",
  "culottes-cortos": "Culotte corto",
  "culottes-largos": "Culotte largo",
};

const SIZE_CHIPS = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const ATTRIBUTE_META: Record<string, { icon: LucideIcon; label: string }> = {
  ligero: { icon: Feather, label: "Ultraligero" },
  transpirable: { icon: Waves, label: "Ultratranspirable" },
  aero: { icon: Wind, label: "Aerodinámico" },
  durable: { icon: Gem, label: "Alta durabilidad" },
  termico: { icon: Thermometer, label: "Protección térmica" },
};

const SWATCH_CLS: Record<string, string> = {
  light: "bg-white",
  medium: "bg-neutral-200",
  ribbed:
    "bg-[repeating-linear-gradient(90deg,#e5e5e5_0_3px,#f8f8f8_3px_6px)]",
};

const DEFAULT_CARE = [
  "Lavar del revés a un máximo de 30 ºC",
  "No usar suavizante, lejía ni secadora",
  "Secar a la sombra y no planchar",
];

function getDisplayDetails(product: Product) {
  if (product.productDetails) return product.productDetails;

  return {
    climate: product.attributes?.includes("termico")
      ? "Entretiempo y días frescos"
      : "Confirma el rango según tu zona",
    fit: "Corte técnico entallado",
    recommendedUse: "Entrenamiento y equipaciones personalizadas",
    construction: product.fabrics?.length
      ? product.fabrics.map((fabric) => `${fabric.name}: ${fabric.description}`)
      : product.features?.slice(0, 3) ?? ["Construcción técnica según el modelo"],
    care: DEFAULT_CARE,
    fiberCompositionNote:
      "Los porcentajes exactos de fibra no están publicados; solicítalos antes de confirmar el pedido si los necesitas.",
    sizingNote:
      "Consulta el recomendador de tallas. Para equipos se puede solicitar un kit de tallaje antes de producir.",
  };
}

export function generateStaticParams() {
  return products.map((product) => ({ handle: product.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = getProductByHandle(handle);
  if (!product) return {};

  const canonical = `/prendas/${product.handle}`;
  return {
    title: product.title,
    description: product.description,
    alternates: { canonical },
    openGraph: {
      title: `${product.title} · RACOR`,
      description: product.description,
      type: "website",
      url: canonical,
      images: [{ url: product.image.src, alt: product.image.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} · RACOR`,
      description: product.description,
      images: [product.image.src],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = getProductByHandle(handle);
  if (!product) notFound();

  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const similar = getSimilarProducts(product);
  const details = getDisplayDetails(product);
  const scoreCardItems = product.guide
    ? getScoreCardItems(product.category)
    : [];
  const accessoryComparison =
    product.category === "chalecos"
      ? VEST_COMPARISON
      : product.category === "culottes-cortos"
        ? SHORT_BIB_COMPARISON
        : product.category === "culottes-largos"
          ? LONG_BIB_COMPARISON
          : undefined;
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: gallery.map((image) => absoluteUrl(image.src)),
    url: absoluteUrl(`/prendas/${product.handle}`),
    brand: { "@type": "Brand", name: "RACOR" },
    category: CATEGORY_LABEL[product.category],
    additionalProperty: [
      { "@type": "PropertyValue", name: "Clima recomendado", value: details.climate },
      { "@type": "PropertyValue", name: "Ajuste", value: details.fit },
      { "@type": "PropertyValue", name: "Uso recomendado", value: details.recommendedUse },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <div className="pt-24 md:pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <div className="mx-auto max-w-[1500px] px-5 md:px-12 lg:px-16">
        <nav aria-label="Migas de pan" className="py-5 text-xs text-neutral-500">
          <Link href="/prendas" className="hover:text-neutral-900">
            Prendas
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-neutral-900" aria-current="page">{product.title}</span>
        </nav>

        <section className="grid gap-10 pb-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(410px,0.9fr)] lg:items-start lg:gap-14 xl:gap-20">
          <ProductGallery images={gallery} />

          <div className="lg:sticky lg:top-24 lg:py-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                {CATEGORY_LABEL[product.category]}
              </p>
              {product.tag && (
                <span className="bg-racor px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                  {product.tag}
                </span>
              )}
            </div>

            <h1 className="mt-3 text-4xl leading-none font-bold uppercase tracking-tight md:text-5xl">
              {product.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600">
              {product.description}
            </p>

            <dl className="mt-7 grid grid-cols-1 border-y border-neutral-200 sm:grid-cols-3 sm:divide-x sm:divide-neutral-200">
              <div className="py-4 sm:pr-4">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-neutral-400">Clima</dt>
                <dd className="mt-1.5 text-sm font-medium">{details.climate}</dd>
              </div>
              <div className="border-t border-neutral-200 py-4 sm:border-t-0 sm:px-4">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-neutral-400">Ajuste</dt>
                <dd className="mt-1.5 text-sm font-medium">{details.fit}</dd>
              </div>
              <div className="border-t border-neutral-200 py-4 sm:border-t-0 sm:pl-4">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-neutral-400">Mejor para</dt>
                <dd className="mt-1.5 text-sm font-medium">{details.recommendedUse}</dd>
              </div>
            </dl>

            {product.attributes?.length && (
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
                {product.attributes.map((attribute) => {
                  const meta = ATTRIBUTE_META[attribute];
                  if (!meta) return null;
                  const Icon = meta.icon;
                  return (
                    <div key={attribute} className="flex items-center gap-2 text-neutral-700">
                      <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.08em]">
                        {meta.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-7 grid gap-2 sm:grid-cols-[1fr_auto]">
              {product.handle === "maillot-morcuera-2-0" && (
                <Link
                  href="/configurador/morcuera-2-0"
                  data-analytics-event="configurator_open"
                  data-analytics-product={product.handle}
                  className="inline-flex min-h-12 items-center justify-center gap-2.5 bg-racor px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:bg-neutral-950 sm:col-span-2"
                >
                  <Palette className="size-4" aria-hidden="true" /> Personalizar en 3D
                </Link>
              )}
              <Link
                href={`/contacto?prenda=${encodeURIComponent(product.title)}`}
                data-analytics-event="product_contact_click"
                data-analytics-product={product.handle}
                className="inline-flex min-h-12 items-center justify-center gap-2.5 bg-neutral-950 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:bg-racor"
              >
                Solicitar diseño y presupuesto <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <a
                href={`https://wa.me/34653224053?text=${encodeURIComponent(`Hola, quiero información sobre ${product.title}`)}`}
                target="_blank"
                rel="noreferrer"
                data-analytics-event="product_whatsapp_click"
                data-analytics-product={product.handle}
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-neutral-300 px-4 text-xs font-semibold uppercase tracking-[0.11em] transition-colors hover:border-neutral-900"
              >
                <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp
              </a>
            </div>
            <p className="mt-2 text-xs text-neutral-400">
              Sin compromiso. Te respondemos con opciones, tallaje y próximos pasos.
            </p>

            <div className="mt-7 grid grid-cols-3 gap-3 border-t border-neutral-200 pt-6">
              {[
                { icon: PackageCheck, title: "Desde 1", text: "Sin mínimo" },
                { icon: Palette, title: "Diseño", text: "Incluido" },
                { icon: Clock3, title: "4 semanas", text: "Aprox." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title}>
                    <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em]">{item.title}</p>
                    <p className="mt-0.5 text-xs text-neutral-400">{item.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 border-t border-neutral-200 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-neutral-400">
                    Tallas disponibles
                  </p>
                  <p className="mt-1 text-sm font-medium">{SIZE_CHIPS.join(" · ")}</p>
                </div>
                <SizeGuideDialog productTitle={product.title} />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-neutral-500">{details.sizingNote}</p>
            </div>
          </div>
        </section>
      </div>

      <section className="border-y border-neutral-200 bg-neutral-100 px-5 py-8 md:px-12 lg:px-16">
        <div className="mx-auto flex max-w-[1360px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-racor">
              Asistente de producto
            </p>
            <h2 className="mt-2 text-xl font-bold uppercase tracking-tight md:text-2xl">
              ¿Tienes dudas sobre {product.title}?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
              Pregunta por talla, clima, cuidados o diferencias con otro modelo. Las respuestas usan la información del catálogo RACOR.
            </p>
          </div>
          <AssistantLauncher className="w-full shrink-0 md:w-auto" />
        </div>
      </section>

      <section className="bg-neutral-950 px-5 py-20 text-white md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/45">Sensaciones y rendimiento</p>
            <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight md:text-4xl">
              Por qué elegir {product.title}
            </h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-white/65">
              {(product.longDescription?.length ? product.longDescription : [product.description]).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          {product.features?.length && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/45">Detalles que importan</p>
              <ul className="mt-4 divide-y divide-white/15 border-y border-white/15">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 py-3.5 text-sm text-white/80">
                    <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section id="ficha-tecnica" className="bg-neutral-50 px-5 py-20 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1360px]">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400">Información técnica</p>
            <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight md:text-4xl">Construcción, tejidos y cuidados</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              Lo publicado por RACOR, separado de lo que todavía debe confirmarse con el presupuesto.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {product.techDrawing && (
              <div className="flex min-h-[420px] items-center justify-center bg-white p-6 md:p-10">
                <Image
                  src={product.techDrawing.src}
                  alt={product.techDrawing.alt}
                  width={1200}
                  height={800}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-auto w-full max-w-2xl object-contain"
                />
              </div>
            )}

            <div className="bg-white p-6 md:p-10">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.1em]">Composición técnica publicada</h3>
                <ul className="mt-4 space-y-3">
                  {details.construction.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-neutral-600">
                      <span className="mt-2 size-1 shrink-0 bg-neutral-900" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                {details.fiberCompositionNote && (
                  <p className="mt-5 border-l-2 border-neutral-300 pl-4 text-xs leading-relaxed text-neutral-500">
                    {details.fiberCompositionNote}
                  </p>
                )}
              </div>

              {product.fabrics?.length && (
                <div className="mt-8 border-t border-neutral-200 pt-7">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.1em]">Tejidos</h3>
                  <ul className="mt-5 space-y-4">
                    {product.fabrics.map((fabric) => (
                      <li key={fabric.name} className="flex items-center gap-4">
                        <span
                          aria-hidden="true"
                          className={`block size-10 shrink-0 border border-neutral-300 ${SWATCH_CLS[fabric.swatch]}`}
                        />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.06em]">{fabric.name}</p>
                          <p className="mt-1 text-xs text-neutral-500">{fabric.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 border-t border-neutral-200 pt-7">
                <h3 className="text-sm font-semibold uppercase tracking-[0.1em]">Cuidados recomendados</h3>
                <ul className="mt-4 space-y-3">
                  {details.care.map((care) => (
                    <li key={care} className="flex gap-3 text-sm text-neutral-600">
                      <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      {care}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {product.handle === "maillot-morcuera-2-0" && (
            <div className="mt-6 grid gap-6 bg-white p-6 md:p-10 lg:grid-cols-2">
              <Image
                src="/assets/racor/capturabuena.png"
                alt="Iconografía técnica del Maillot Morcuera 2.0"
                width={600}
                height={400}
                className="mx-auto h-auto w-full max-w-sm object-contain"
              />
              <Image
                src="/assets/racor/tirodelmaillot.png"
                alt="Patrones STR y LENG del tiro del Maillot Morcuera 2.0"
                width={1024}
                height={722}
                className="mx-auto h-auto w-full max-w-xl object-contain"
              />
            </div>
          )}
        </div>
      </section>

      {product.guide && (
        <section className="px-5 py-20 md:px-12 md:py-28 lg:px-16">
          <div className="mx-auto max-w-[1360px]">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400">Compara antes de decidir</p>
              <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight md:text-4xl">¿Qué prenda te encaja?</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                Mueve el cursor de temperatura. Rangos y puntuaciones salen de la información publicada de cada modelo.
              </p>
            </div>

            <div className="mt-9">
              <TempComparator
                currentHandle={product.handle}
                defaultTemp={Math.round(
                  (product.guide.tempRange[0] + product.guide.tempRange[1]) / 2,
                )}
                items={getTempComparatorItems()}
              />
            </div>

            {scoreCardItems.length > 1 && (
              <div className="mt-6">
                <ScoreCards
                  currentHandle={product.handle}
                  items={scoreCardItems}
                />
              </div>
            )}

            {product.category === "maillots" && (
              <div className="mt-12">
                <ProductFinder />
              </div>
            )}
          </div>
        </section>
      )}

      {accessoryComparison && (
        <section className="px-5 py-20 md:px-12 md:py-28 lg:px-16">
          <div className="mx-auto max-w-[1360px]">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
                Compara antes de decidir
              </p>
              <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight md:text-4xl">
                {product.category === "chalecos"
                  ? "¿Qué chaleco te encaja?"
                  : product.category === "culottes-cortos"
                    ? "Elige cómo personalizar tu culotte"
                    : "Rascafría o Lozoya / Buitrago"}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                {product.category === "chalecos"
                  ? "Compara protección, volumen y capacidad: dos cortavientos plegables y una opción térmica."
                  : product.category === "culottes-cortos"
                    ? "La diferencia principal está en la superficie sublimada, la estabilidad del color y los bolsillos cargo."
                    : "Elige entre una base térmica de color sólido o dos niveles de personalización por sublimación."}
              </p>
            </div>

            <div className="mt-9 overflow-x-auto border border-neutral-200">
              <table className="w-full min-w-[960px] border-collapse text-left text-sm">
                <thead className="bg-neutral-950 text-white">
                  <tr>
                    {[
                      "Modelo",
                      "Construcción",
                      "Clima",
                      "Personalización",
                      "Bolsillos",
                      "Mejor para",
                    ].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.1em]"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {accessoryComparison.map((item) => (
                    <tr
                      key={item.handle}
                      className={
                        item.handle === product.handle
                          ? "bg-racor/5"
                          : "border-t border-neutral-200"
                      }
                    >
                      <th scope="row" className="px-4 py-4 font-semibold">
                        <Link
                          href={`/prendas/${item.handle}`}
                          className="underline-offset-4 hover:underline"
                        >
                          {item.title}
                        </Link>
                        {item.handle === product.handle && (
                          <span className="ml-2 text-[9px] uppercase tracking-[0.1em] text-racor">
                            Estás aquí
                          </span>
                        )}
                      </th>
                      <td className="px-4 py-4 text-neutral-600">
                        {item.construction}
                      </td>
                      <td className="px-4 py-4 text-neutral-600">
                        {item.climate}
                      </td>
                      <td className="px-4 py-4 text-neutral-600">
                        {item.personalization}
                      </td>
                      <td className="px-4 py-4 text-neutral-600">
                        {item.storage}
                      </td>
                      <td className="px-4 py-4 font-medium">{item.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section className="border-y border-neutral-200 bg-neutral-50 px-5 py-20 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400">Antes de pedir</p>
            <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight">Dudas frecuentes</h2>
          </div>
          <div className="divide-y divide-neutral-300 border-y border-neutral-300">
            {[
              {
                question: "¿Puedo pedir una sola prenda?",
                answer: "Sí. RACOR trabaja desde una unidad, con diseño incluido y la misma personalización.",
              },
              {
                question: "¿Cuál es el plazo?",
                answer: "La referencia actual es de unas cuatro semanas desde la aprobación definitiva del diseño. La fecha concreta se confirma en cada propuesta.",
              },
              {
                question: "¿Cómo funcionan el envío y los cambios?",
                answer: "Al ser una prenda producida a medida, el transporte y las condiciones aplicables se detallan por escrito antes de confirmar el pedido. Pide esa información con tu presupuesto.",
              },
              {
                question: "¿Y si tengo dudas con la talla?",
                answer: "Puedes usar el recomendador. Para clubes y equipos también se puede solicitar un kit de tallaje antes de producir.",
              },
            ].map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold uppercase tracking-[0.04em]">
                  {item.question}
                  <span aria-hidden="true" className="text-xl font-light transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-2xl pt-4 text-sm leading-relaxed text-neutral-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="px-5 py-20 md:px-12 md:py-28 lg:px-16">
          <div className="mx-auto max-w-[1360px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400">Alternativas con una razón</p>
            <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight md:text-4xl">Elige según tu prioridad</h2>
            <div className="mt-10 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((item) => {
                const decision =
                  getAccessoryDecision(item.handle) ??
                  getColdWeatherDecision(item.handle) ??
                  getLongSleeveDecision(item.handle) ??
                  getMaillotDecision(item.handle);
                return (
                  <article key={item.id} className="group bg-neutral-50">
                    <Link href={`/prendas/${item.handle}`} className="block">
                      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-racor">
                          Mejor para · {decision?.bestFor ?? "completar tu equipación"}
                        </p>
                        <h3 className="mt-2 text-xl font-bold uppercase">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                          {decision?.summary ?? item.description}
                        </p>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-racor px-5 py-20 text-center text-white md:px-12 md:py-28 lg:px-16">
        <h2 className="text-3xl font-bold uppercase tracking-tight md:text-5xl">¿Lo hacemos tuyo?</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/65">
          Cuéntanos colores, logotipos, cantidades y fecha objetivo. El equipo te propone el siguiente paso.
        </p>
        <Link
          href={`/contacto?prenda=${encodeURIComponent(product.title)}`}
          data-analytics-event="product_final_contact_click"
          data-analytics-product={product.handle}
          className="mt-8 inline-flex items-center gap-2 border border-white px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-white hover:text-racor"
        >
          Pedir propuesta <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
