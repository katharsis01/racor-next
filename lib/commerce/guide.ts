import { products } from "./local";
import type { Product, ProductCategory } from "./types";

import type {
  ScoreCardItem,
  TempComparatorItem,
} from "@/components/site/temp-comparator";

const GUIDE_CATEGORY_LABEL: Partial<Record<ProductCategory, string>> = {
  maillots: "Maillot",
  "manga-larga": "Manga larga",
  termicos: "Térmico",
  chaquetas: "Chaqueta",
};

type GuidedProduct = Product & { guide: NonNullable<Product["guide"]> };

const hasGuide = (product: Product): product is GuidedProduct =>
  Boolean(product.guide);

/** Prendas con rango térmico, de más calurosa a más fría (para el termómetro). */
export function getTempComparatorItems(): TempComparatorItem[] {
  return products
    .filter(hasGuide)
    .sort(
      (a, b) =>
        b.guide.tempRange[1] - a.guide.tempRange[1] ||
        b.guide.tempRange[0] - a.guide.tempRange[0],
    )
    .map((product) => ({
      handle: product.handle,
      title: product.title,
      categoryLabel: GUIDE_CATEGORY_LABEL[product.category] ?? product.category,
      tempRange: product.guide.tempRange,
      estimatedRange: product.guide.estimatedRange,
    }));
}

/** Puntuaciones 1–5 de las prendas de una categoría (para la escala de puntos). */
export function getScoreCardItems(category: ProductCategory): ScoreCardItem[] {
  return products
    .filter(hasGuide)
    .filter((product) => product.category === category && product.guide.scores)
    .map((product) => ({
      handle: product.handle,
      title: product.title,
      scores: product.guide.scores ?? {},
    }));
}
