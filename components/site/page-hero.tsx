import type { ReactNode } from "react";

export function PageHero({
  kicker,
  title,
  intro,
}: {
  kicker?: string;
  title: ReactNode;
  intro?: string;
}) {
  return (
    <section className="px-5 pt-32 pb-12 md:px-12 md:pt-36 md:pb-16 lg:px-16">
      {kicker && (
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-neutral-500">
          {kicker}
        </p>
      )}
      <h1 className="text-4xl leading-[1.02] font-bold tracking-tight uppercase md:text-6xl lg:text-7xl">
        {title}
      </h1>
      {intro && (
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-neutral-500">
          {intro}
        </p>
      )}
    </section>
  );
}

export function SectionHead({
  title,
  sub,
}: {
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-10 px-5 md:mb-14 md:px-12 lg:px-16">
      <h2 className="text-3xl font-bold tracking-tight uppercase md:text-4xl lg:text-[44px]">
        {title}
      </h2>
      {sub && <p className="mt-2 text-[15px] text-neutral-500">{sub}</p>}
    </div>
  );
}
