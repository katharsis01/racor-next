"use client";

import dynamic from "next/dynamic";

// Sin SSR: el configurador restaura el diseño guardado desde localStorage
// al inicializar su estado, algo que solo puede ocurrir en el navegador.
export const JerseyConfiguratorLazy = dynamic(
  () =>
    import("./jersey-configurator").then((module) => module.JerseyConfigurator),
  {
    loading: () => (
      <section className="px-5 pb-20 md:px-12 md:pb-28 lg:px-16">
        <div className="mx-auto grid min-h-[520px] max-w-[1500px] place-items-center border border-neutral-200 bg-white lg:min-h-[760px]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
            Cargando configurador
          </p>
        </div>
      </section>
    ),
    ssr: false,
  },
);
