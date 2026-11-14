"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type LookItem = {
  handle: string;
  title: string;
  category: string;
  note: string;
  /** Posición del punto en % sobre la foto (cuadrada). */
  x: number;
  y: number;
};

export type Look = {
  name: string;
  description: string;
  image: { src: string; alt: string };
  items: LookItem[];
};

export function LookBlock({
  look,
  reverse = false,
}: {
  look: Look;
  reverse?: boolean;
}) {
  const [active, setActive] = useState(0);

  return (
    <div
      className={cn(
        "grid gap-0.5 lg:grid-cols-[1fr_0.7fr]",
        reverse && "lg:grid-cols-[0.7fr_1fr]",
      )}
    >
      <div
        className={cn(
          "relative aspect-square overflow-hidden bg-neutral-100",
          reverse && "lg:order-2",
        )}
      >
        <Image
          alt={look.image.alt}
          className="object-cover"
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          src={look.image.src}
        />
        {look.items.map((item, index) => (
          <button
            aria-label={`Ver ${item.title}`}
            aria-pressed={active === index}
            className="absolute z-10 grid size-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center"
            key={item.handle}
            onClick={() => setActive(index)}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            type="button"
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-0 rounded-full bg-white/50 motion-reduce:hidden",
                active === index && "animate-ping",
              )}
            />
            <span
              className={cn(
                "relative grid size-7 place-items-center rounded-full border shadow-sm transition-colors",
                active === index
                  ? "border-white bg-racor text-white"
                  : "border-neutral-900/20 bg-white text-neutral-900",
              )}
            >
              <Plus aria-hidden="true" className="size-4" />
            </span>
          </button>
        ))}
      </div>

      <div
        className={cn(
          "flex flex-col justify-between gap-8 bg-neutral-100 p-6 md:p-10",
          reverse && "lg:order-1",
        )}
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-racor">
            Consigue el look
          </p>
          <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight md:text-3xl">
            {look.name}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-500">
            {look.description}
          </p>

          <div className="mt-6 space-y-2">
            {look.items.map((item, index) => (
              <article
                className={cn(
                  "border bg-white p-5 transition-colors",
                  active === index ? "border-neutral-900" : "border-transparent",
                )}
                key={item.handle}
                onMouseEnter={() => setActive(index)}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-racor">
                  {item.category}
                </p>
                <h3 className="mt-1.5 text-xl font-bold uppercase">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                  {item.note}
                </p>
                <Link
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] underline-offset-4 hover:underline"
                  href={`/prendas/${item.handle}`}
                >
                  Ver prenda <ArrowRight aria-hidden="true" className="size-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-neutral-500">
          Todo el look se personaliza con tus colores y tu logo, desde 1 unidad.{" "}
          <Link
            className="font-semibold text-neutral-900 underline underline-offset-4 hover:opacity-60"
            href={`/contacto?prenda=${encodeURIComponent(`Look ${look.name} completo`)}`}
          >
            Pide el tuyo
          </Link>
        </p>
      </div>
    </div>
  );
}
