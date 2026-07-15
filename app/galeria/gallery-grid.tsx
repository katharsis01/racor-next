"use client";

import Image from "next/image";
import type { GalleryItem } from "@/lib/commerce/types";
import { useLightbox } from "@/components/site/lightbox";
import { Reveal } from "@/components/site/reveal";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const { open } = useLightbox();

  return (
    <div className="grid grid-cols-1 gap-0.5 px-5 pb-20 sm:grid-cols-2 md:px-12 lg:px-16">
      {items.map((item, i) => (
        <Reveal key={`${item.src}-${i}`}>
          <button
            type="button"
            onClick={() => open(items, i)}
            className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-neutral-100"
            aria-label={`Ver ${item.caption} en grande`}
          >
            <Image
              src={item.src}
              alt={item.caption}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
          </button>
        </Reveal>
      ))}
    </div>
  );
}
