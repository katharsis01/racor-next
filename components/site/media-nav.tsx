import Link from "next/link";
import { Camera, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function MediaNav({ active }: { active: "photos" | "videos" }) {
  const items = [
    { href: "/galeria", label: "Fotografías", value: "photos", icon: Camera },
    { href: "/videos", label: "Vídeos", value: "videos", icon: Play },
  ] as const;

  return (
    <nav aria-label="Tipo de galería" className="px-5 pb-10 md:px-12 lg:px-16">
      <div className="inline-flex border border-neutral-900">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = active === item.value;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={selected ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
                selected
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-900 hover:bg-neutral-100"
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
