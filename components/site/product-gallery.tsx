"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductImage } from "@/lib/commerce/types";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);
  const activeImage = images[active];

  function showPrevious() {
    setActive((current) => (current === 0 ? images.length - 1 : current - 1));
  }

  function showNext() {
    setActive((current) => (current === images.length - 1 ? 0 : current + 1));
  }

  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <Image
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          priority
          loading="eager"
          sizes="(max-width: 1024px) 100vw, 56vw"
          className="object-contain p-5 md:p-10"
        />

        {images.length > 1 && (
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
            <div className="flex gap-1.5" aria-hidden="true">
              {images.map((image, index) => (
                <span
                  key={image.src}
                  className={`h-1 w-7 transition-colors ${
                    index === active ? "bg-neutral-900" : "bg-neutral-300"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={showPrevious}
                className="grid size-10 place-items-center border border-neutral-300 bg-white transition-colors hover:border-neutral-900"
                aria-label="Ver imagen anterior"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="grid size-10 place-items-center border border-neutral-300 bg-white transition-colors hover:border-neutral-900"
                aria-label="Ver imagen siguiente"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          Imagen {active + 1} de {images.length}: {activeImage.alt}
        </p>
      </div>

      {images.length > 1 && (
        <div className="mt-1 grid grid-flow-col auto-cols-fr gap-1">
          {images.map((img, index) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(index)}
              className={`relative aspect-square overflow-hidden bg-neutral-100 transition-opacity ${
                index === active
                  ? "opacity-100 ring-1 ring-neutral-900 ring-inset"
                  : "opacity-65 hover:opacity-100"
              }`}
              aria-label={`Mostrar ${img.alt}`}
              aria-pressed={index === active}
            >
              <Image
                src={img.src}
                alt=""
                fill
                sizes="18vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
