import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { InstagramGrid } from "@/components/site/instagram-grid";
import { InstagramIcon } from "@/components/site/instagram-icon";
import { PageHero } from "@/components/site/page-hero";
import { INSTAGRAM_PROFILE } from "@/lib/social";

export const metadata: Metadata = {
  title: "Instagram",
  description: "Galería de equipaciones y salidas ciclistas de RACOR.",
};

export default function InstagramPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <PageHero
        kicker="Instagram"
        title="RACOR"
        intro="Equipaciones, detalles y kilómetros compartidos por nuestra comunidad ciclista."
      />

      <section className="px-5 pb-24 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-7 flex items-center justify-between gap-5 border-t border-neutral-900/20 pt-5 md:mb-9">
            <div className="flex items-center gap-3 text-neutral-500">
              <InstagramIcon className="size-4.5" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                Galería
              </p>
            </div>
            <a
              href={INSTAGRAM_PROFILE}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.11em]"
            >
              Ver Instagram
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
          <InstagramGrid />
        </div>
      </section>
    </main>
  );
}
