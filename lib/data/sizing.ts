/**
 * Guía de tallas RACOR.
 * Valores estándar de ciclismo de carretera (cm). El tallaje es válido para
 * cualquier prenda del catálogo (maillots, manga larga, chaquetas, chalecos,
 * culottes y monos), como en la web original.
 */

export type Gender = "hombre" | "mujer";

export interface SizeRow {
  size: string;
  altura: [number, number];
  pecho: [number, number];
  cintura: [number, number];
  cadera?: [number, number];
}

export const SIZES: Record<Gender, SizeRow[]> = {
  hombre: [
    { size: "XS", altura: [160, 168], pecho: [84, 90], cintura: [72, 78] },
    { size: "S", altura: [166, 174], pecho: [88, 94], cintura: [76, 82] },
    { size: "M", altura: [172, 180], pecho: [92, 98], cintura: [80, 86] },
    { size: "L", altura: [178, 186], pecho: [96, 104], cintura: [84, 92] },
    { size: "XL", altura: [184, 192], pecho: [102, 110], cintura: [90, 100] },
    { size: "2XL", altura: [188, 196], pecho: [108, 118], cintura: [98, 108] },
    { size: "3XL", altura: [190, 200], pecho: [116, 126], cintura: [106, 116] },
  ],
  mujer: [
    { size: "XS", altura: [152, 160], pecho: [78, 84], cintura: [60, 66], cadera: [84, 90] },
    { size: "S", altura: [158, 166], pecho: [82, 88], cintura: [64, 70], cadera: [88, 94] },
    { size: "M", altura: [164, 172], pecho: [86, 92], cintura: [68, 76], cadera: [92, 98] },
    { size: "L", altura: [170, 178], pecho: [90, 98], cintura: [74, 82], cadera: [96, 104] },
    { size: "XL", altura: [174, 182], pecho: [96, 106], cintura: [80, 90], cadera: [102, 112] },
  ],
};

export const MEASURE_STEPS = [
  {
    t: "Pecho",
    d: "Rodea con la cinta la parte más ancha del torso, bajo las axilas, con la cinta horizontal y sin apretar.",
  },
  {
    t: "Cintura",
    d: "Mide el contorno a la altura del ombligo, sin meter tripa: la prenda trabajará ahí durante horas.",
  },
  {
    t: "Cadera",
    d: "Contorno en la parte más ancha de la cadera, de pie y con los pies juntos.",
  },
  {
    t: "Altura",
    d: "Descalzo, de espaldas a la pared, desde el suelo hasta la coronilla.",
  },
];

export const FIT_NOTES = [
  {
    t: "Corte Race",
    d: "Ajustado al cuerpo, pensado para posición agresiva y máxima aerodinámica. Si dudas entre dos tallas, elige la menor.",
  },
  {
    t: "Corte Confort",
    d: "Patrón más relajado en pecho y abdomen, ideal para marchas largas y cicloturismo. Si dudas entre dos tallas, elige la mayor.",
  },
];

/**
 * Recomendador: devuelve la(s) talla(s) sugerida(s) a partir del contorno de
 * pecho (obligatorio) y la altura (desempate).
 */
export function recommendSize(
  gender: Gender,
  pecho: number,
  altura?: number
): string[] {
  const rows = SIZES[gender];
  const byChest = rows.filter((r) => pecho >= r.pecho[0] && pecho <= r.pecho[1]);

  if (byChest.length === 0) {
    if (pecho < rows[0].pecho[0]) return [rows[0].size];
    if (pecho > rows[rows.length - 1].pecho[1]) return [rows[rows.length - 1].size];
    return [];
  }
  if (byChest.length === 1 || !altura) return byChest.map((r) => r.size);

  const byHeight = byChest.filter(
    (r) => altura >= r.altura[0] && altura <= r.altura[1]
  );
  return (byHeight.length ? byHeight : byChest).map((r) => r.size);
}
