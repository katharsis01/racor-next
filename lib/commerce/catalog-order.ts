import type { Product } from "./types";

const DISPLAY_PRIORITY = new Map<string, number>([
  ["maillot-manga-larga-fuenfria", 10],
  ["maillot-manga-larga-cruz-verde", 20],
  ["maillot-manga-larga-termico-cotos", 30],
  ["maillot-manga-larga-termico-alto-del-leon", 40],
  ["chaqueta-navacerrada", 50],
  ["chaqueta-bola-del-mundo", 60],
  ["chaleco-miraflores", 70],
  ["chaleco-soto-del-real", 80],
  ["chaleco-escorial", 90],
  ["culotte-puebla", 100],
  ["culotte-hiruela", 110],
  ["culotte-cardoso", 120],
  ["culotte-somosierra", 130],
  ["culotte-rascafria", 140],
  ["culotte-lozoya-buitrago", 150],
]);

export function sortProductsForDisplay(items: Product[]) {
  return [...items].sort(
    (first, second) =>
      (DISPLAY_PRIORITY.get(first.handle) ?? 1_000) -
      (DISPLAY_PRIORITY.get(second.handle) ?? 1_000)
  );
}
