import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JerseyConfiguratorLazy } from "@/components/site/jersey-configurator-lazy";

export const metadata: Metadata = {
  title: "Configurador 3D Morcuera 2.0",
  description:
    "Personaliza en 3D el maillot Morcuera 2.0 de RACOR: colores y logo de tu equipo en tiempo real.",
};

export default function MorcueraConfiguratorPage() {
  return (
    <div className="pt-24 md:pt-28">
      <header className="px-5 pt-10 pb-10 md:px-12 md:pt-14 md:pb-14 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <Link
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500 transition-colors hover:text-neutral-950"
            href="/prendas/maillot-morcuera-2-0"
          >
            <ArrowLeft className="size-3.5" /> Volver al producto
          </Link>
          <div className="mt-8 max-w-4xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-racor">
              Laboratorio RACOR · Prototipo interactivo
            </p>
            <h1 className="mt-3 text-4xl leading-[0.95] font-bold uppercase tracking-tight md:text-6xl lg:text-7xl">
              Morcuera 2.0
              <br />a tu manera
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">
              Gira el maillot, combina sus zonas y coloca el logo de tu equipo. Esta primera versión nos permitirá decidir juntos qué herramientas añadir después.
            </p>
          </div>
        </div>
      </header>

      <JerseyConfiguratorLazy />
    </div>
  );
}
