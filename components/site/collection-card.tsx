"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import { Reveal } from "./reveal";

const CATEGORY_LABEL: Record<Product["category"], string> = {
  maillots: "Maillot",
  "manga-larga": "Maillot manga larga",
  termicos: "Maillot térmico",
  chaquetas: "Chaqueta",
  chalecos: "Chaleco",
  "culottes-cortos": "Culotte corto",
  "culottes-largos": "Culotte largo",
};

/** Card de colección estilo Gobik: imagen, hover con segunda foto, ficha al pinchar. */
export function CollectionCard({
  product,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
  priority = false,
}: {
  product: Product;
  sizes?: string;
  priority?: boolean;
}) {
  const second = product.gallery?.[1];

  return (
    <Reveal>
      <article className="group">
        <Link
          href={`/prendas/${product.handle}`}
          className="relative block aspect-[4/5] w-full overflow-hidden bg-neutral-100"
        >
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes={sizes}
            className={`object-cover transition-[opacity,transform] duration-700 ease-out motion-safe:group-hover:scale-[1.045] motion-safe:group-focus-within:scale-[1.045] motion-reduce:transition-none ${second ? "group-hover:opacity-0 group-focus-within:opacity-0" : ""}`}
          />
          {second && (
            <Image
              src={second.src}
              alt={second.alt}
              fill
              sizes={sizes}
              className="scale-[1.045] object-cover opacity-0 transition-[opacity,transform] duration-700 ease-out group-hover:opacity-100 group-focus-within:opacity-100 motion-safe:group-hover:scale-100 motion-safe:group-focus-within:scale-100 motion-reduce:transition-none"
            />
          )}
          {product.tag && (
            <span className="absolute top-3 left-3 bg-white px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-900">
              {product.tag}
            </span>
          )}
        </Link>
        <div className="px-1 pt-3.5 pb-8">
          <p className="text-[11px] uppercase tracking-[0.1em] text-neutral-400">
            {CATEGORY_LABEL[product.category]}
          </p>
          <Link href={`/prendas/${product.handle}`} className="group/link">
            <h3 className="mt-0.5 text-sm font-semibold uppercase tracking-[0.04em] group-hover/link:underline">
              {product.title}
            </h3>
          </Link>
          <p className="mt-0.5 line-clamp-1 text-[13px] text-neutral-500">
            {product.description}
          </p>
          <Link
            href={`/prendas/${product.handle}`}
            className="mt-2 inline-block text-[11px] font-medium uppercase tracking-[0.12em] underline-offset-4 hover:underline"
          >
            Ver +
          </Link>
        </div>
      </article>
    </Reveal>
  );
}
