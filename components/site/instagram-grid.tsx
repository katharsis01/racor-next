import Image from "next/image";
import { InstagramIcon } from "@/components/site/instagram-icon";
import { INSTAGRAM_POSTS } from "@/lib/social";

export function InstagramGrid() {
  return (
    <div className="grid grid-cols-2 gap-1.5 md:grid-cols-3 md:gap-2 lg:grid-cols-4">
      {INSTAGRAM_POSTS.map((post, index) => (
        <a
          key={post.href}
          href={post.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Ver publicación ${index + 1} de RACOR en Instagram`}
          className="group relative block aspect-square overflow-hidden bg-neutral-100"
        >
          <Image
            src={post.src}
            alt={post.alt}
            fill
            sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transition-none"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
          <span className="absolute right-3 bottom-3 grid size-9 translate-y-2 place-items-center bg-white text-neutral-950 opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:right-4 md:bottom-4 md:size-10">
            <InstagramIcon className="size-4" />
          </span>
        </a>
      ))}
    </div>
  );
}
