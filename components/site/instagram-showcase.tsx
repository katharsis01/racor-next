import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { InstagramGrid } from "@/components/site/instagram-grid";
import { InstagramIcon } from "@/components/site/instagram-icon";
import { INSTAGRAM_PROFILE } from "@/lib/social";

export function InstagramShowcase() {
  return (
    <section className="border-t border-neutral-900/10 bg-white px-5 py-24 text-neutral-950 md:px-12 md:py-32 lg:px-16">
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-10 grid gap-8 md:mb-14 md:grid-cols-[1fr_1.1fr] md:items-end">
          <div>
            <div className="flex items-center gap-3 text-neutral-500">
              <InstagramIcon className="size-5" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.17em]">
                Instagram
              </p>
            </div>
            <h2 className="mt-5 text-4xl leading-none font-bold uppercase tracking-tight md:text-6xl lg:text-7xl">
              RACOR
            </h2>
          </div>

          <div className="md:max-w-md md:justify-self-end">
            <p className="text-[15px] leading-relaxed text-neutral-500">
              Equipaciones, detalles y kilómetros compartidos por nuestra
              comunidad ciclista.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
              <Link
                href="/instagram"
                className="group inline-flex min-h-11 items-center gap-3 border-b border-neutral-900/40 pb-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:border-neutral-900"
              >
                Ver galería
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <a
                href={INSTAGRAM_PROFILE}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-h-11 items-center gap-3 border-b border-neutral-900/40 pb-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:border-neutral-900"
              >
                Abrir Instagram
                <ArrowUpRight
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>

        <InstagramGrid />
      </div>
    </section>
  );
}
