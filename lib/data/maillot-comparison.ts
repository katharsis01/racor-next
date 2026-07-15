export interface MaillotDecision {
  handle: string;
  title: string;
  temperature: string;
  ventilation: string;
  aerodynamics: string;
  durability: string;
  fit: string;
  bestFor: string;
  summary: string;
}

export interface LongSleeveDecision {
  handle: string;
  title: string;
  temperature: string;
  fabric: string;
  thermalProtection: string;
  fit: string;
  zipper: string;
  bestFor: string;
  summary: string;
}

export interface ColdWeatherDecision {
  handle: string;
  title: string;
  temperature: string;
  protection: string;
  weather: string;
  ventilation: string;
  personalization: string;
  bestFor: string;
  summary: string;
}

export interface AccessoryDecision {
  handle: string;
  title: string;
  construction: string;
  climate: string;
  personalization: string;
  storage: string;
  bestFor: string;
  summary: string;
}

export const MAILLOT_DECISIONS: MaillotDecision[] = [
  {
    handle: "maillot-morcuera-2-0",
    title: "Morcuera 2.0",
    temperature: "Calor intenso",
    ventilation: "Muy alta",
    aerodynamics: "Alta",
    durability: "Alta",
    fit: "Fit muy entallado",
    bestFor: "Máximo rendimiento",
    summary:
      "La opción más completa para calor intenso, ajuste preciso y rendimiento aerodinámico.",
  },
  {
    handle: "maillot-morcuera-oficial",
    title: "Morcuera",
    temperature: "Calor",
    ventilation: "Muy alta",
    aerodynamics: "Media–alta",
    durability: "Media",
    fit: "Entallado",
    bestFor: "Equilibrio general",
    summary:
      "El modelo superventas para quien busca ligereza y transpirabilidad sin complicarse.",
  },
  {
    handle: "maillot-navafria-oficial",
    title: "Navafría",
    temperature: "Calor",
    ventilation: "Alta · manga rejilla",
    aerodynamics: "Media",
    durability: "Media",
    fit: "Entallado",
    bestFor: "Ventilación y estilo",
    summary:
      "Destaca por sus mangas de rejilla y una sensación ventilada en días calurosos.",
  },
  {
    handle: "maillot-canencia",
    title: "Canencia",
    temperature: "Templado / calor",
    ventilation: "Alta",
    aerodynamics: "Media",
    durability: "Muy alta",
    fit: "Entallado",
    bestFor: "Uso intensivo",
    summary:
      "La alternativa más resistente gracias a sus tejidos de mayor gramaje.",
  },
  {
    handle: "maillot-manga-larga-fuenfria",
    title: "Fuenfría",
    temperature: "18–22 ºC",
    ventilation: "Alta",
    aerodynamics: "No publicado",
    durability: "Alta",
    fit: "Fit muy entallado",
    bestFor: "Entretiempo",
    summary:
      "La recomendación para mañanas frescas de otoño y primavera entre 18 y 22 ºC.",
  },
];

export const SHORT_SLEEVE_COMPARISON = MAILLOT_DECISIONS.slice(0, 4);

export const LONG_SLEEVE_COMPARISON: LongSleeveDecision[] = [
  {
    handle: "maillot-manga-larga-fuenfria",
    title: "Fuenfría",
    temperature: "18–22 ºC",
    fabric: "Fino, sin rejilla · 115 g/m²",
    thermalProtection: "Ligera",
    fit: "Fit muy entallado",
    zipper: "Oculta",
    bestFor: "Entretiempo suave",
    summary:
      "La opción fina y transpirable para mañanas frescas de otoño y primavera entre 18 y 22 ºC.",
  },
  {
    handle: "maillot-manga-larga-cruz-verde",
    title: "Cruz Verde",
    temperature: "15–20 ºC",
    fabric: "Lycra semitérmica · 230 g/m²",
    thermalProtection: "Media",
    fit: "Ajustado y elástico",
    zipper: "Vista",
    bestFor: "Entretiempo más frío",
    summary:
      "La alternativa más abrigada para días frescos, con lycra gruesa semitérmica de 230 g/m².",
  },
];

export const THERMAL_COMPARISON: ColdWeatherDecision[] = [
  {
    handle: "maillot-manga-larga-termico-cotos",
    title: "Cotos",
    temperature: "10–18 ºC",
    protection: "Térmico perchado",
    weather: "Seco · no lluvia",
    ventilation: "Muy alta",
    personalization: "Diseño custom",
    bestFor: "Otoño y primavera",
    summary:
      "La opción más ventilada para clima seco y fresco, con interior perchado y sin membrana cortaviento.",
  },
  {
    handle: "maillot-manga-larga-termico-alto-del-leon",
    title: "Alto del León",
    temperature: "8–16 ºC",
    protection: "Full Black / Dark Blue perchado",
    weather: "Seco · no lluvia",
    ventilation: "Alta",
    personalization: "Logotipos Direct Transfer",
    bestFor: "Rendimiento invernal",
    summary:
      "Más ajustado y aerodinámico, sobre base Full Black o Full Dark Blue y para temperaturas algo más bajas.",
  },
];

export const JACKET_COMPARISON: ColdWeatherDecision[] = [
  {
    handle: "chaqueta-navacerrada",
    title: "Navacerrada",
    temperature: "8–16 ºC",
    protection: "Térmico perchado",
    weather: "Seco · no lluvia",
    ventilation: "Muy alta",
    personalization: "Diseño custom",
    bestFor: "Ciclistas calurosos",
    summary:
      "Protege del frío manteniendo mucha ventilación; no incorpora membrana cortaviento y no es para lluvia.",
  },
  {
    handle: "chaqueta-bola-del-mundo",
    title: "Bola del Mundo",
    temperature: "<0–15 ºC",
    protection: "Softshell de doble capa",
    weather: "Viento y lluvia",
    ventilation: "Alta en brazos y axilas",
    personalization: "Diseño custom",
    bestFor: "Invierno exigente",
    summary:
      "La opción más protectora: hidrófuga, cortaviento y preparada para frío intenso y días lluviosos.",
  },
];

export const VEST_COMPARISON: AccessoryDecision[] = [
  {
    handle: "chaleco-miraflores",
    title: "Miraflores",
    construction: "Cortavientos Serie I",
    climate: "Viento y humedad ligera",
    personalization: "Diseño custom integral",
    storage: "Acceso a bolsillos del maillot",
    bestFor: "Más aislamiento sin peso",
    summary:
      "El cortavientos plegable más completo, con frontal protector y espalda de malla muy ventilada.",
  },
  {
    handle: "chaleco-soto-del-real",
    title: "Soto del Real",
    construction: "Cortavientos Serie II",
    climate: "Viento y descensos",
    personalization: "Diseño custom integral",
    storage: "Acceso a bolsillos del maillot",
    bestFor: "Mínimo volumen",
    summary:
      "La alternativa más fina y ligera; protege menos que Miraflores y ocupa muy poco en el bolsillo.",
  },
  {
    handle: "chaleco-escorial",
    title: "Escorial",
    construction: "Softshell de doble capa",
    climate: "0–16 ºC · viento y humedad",
    personalization: "Diseño custom integral",
    storage: "3 bolsillos traseros",
    bestFor: "Invierno y frío",
    summary:
      "El chaleco térmico para priorizar abrigo, protección frontal y capacidad de carga.",
  },
];

export const SHORT_BIB_COMPARISON: AccessoryDecision[] = [
  {
    handle: "culotte-puebla",
    title: "Puebla",
    construction: "Base de color sólido",
    climate: "Templado y cálido",
    personalization: "Direct Transfer + 3 grips",
    storage: "Sin bolsillos publicados",
    bestFor: "Color estable al estirar",
    summary:
      "La opción de color sólido con logotipos Direct Transfer y tres acabados de pierna.",
  },
  {
    handle: "culotte-hiruela",
    title: "Hiruela",
    construction: "Sólido + zonas sublimadas",
    climate: "Templado y cálido",
    personalization: "Grip, lateral y trasera",
    storage: "Sin bolsillos publicados",
    bestFor: "Equilibrio diseño/durabilidad",
    summary:
      "Personaliza las zonas visibles y mantiene sólido el tejido que está en contacto con el sillín.",
  },
  {
    handle: "culotte-cardoso",
    title: "Cardoso",
    construction: "Full sublimado",
    climate: "Templado y cálido",
    personalization: "Todos los paneles",
    storage: "Sin bolsillos publicados",
    bestFor: "Libertad gráfica total",
    summary:
      "El modelo completamente sublimado para extender el diseño a todos los paneles.",
  },
  {
    handle: "culotte-somosierra",
    title: "Somosierra",
    construction: "Culotte cargo",
    climate: "Templado y cálido",
    personalization: "Diseño custom",
    storage: "2 bolsillos de pierna + 2 lumbares",
    bestFor: "Gravel y cicloturismo",
    summary:
      "La opción cargo para rutas largas, viajes y salidas con necesidad de almacenamiento.",
  },
];

export const LONG_BIB_COMPARISON: AccessoryDecision[] = [
  {
    handle: "culotte-rascafria",
    title: "Rascafría",
    construction: "Térmico de color sólido",
    climate: "Invierno · rango no publicado",
    personalization: "Logotipos Direct Transfer",
    storage: "Sin bolsillos publicados",
    bestFor: "Base negra o azul estable",
    summary:
      "La opción térmica de base sólida con interior perchado y logotipos aplicados a color.",
  },
  {
    handle: "culotte-lozoya-buitrago",
    title: "Lozoya / Buitrago",
    construction: "Culotte largo sublimado",
    climate: "Invierno · rango no publicado",
    personalization: "Banda o panel completo",
    storage: "Sin bolsillos publicados",
    bestFor: "Coordinar toda la equipación",
    summary:
      "Dos niveles de sublimación para combinar el culotte con maillot, chaleco o chaqueta.",
  },
];

export function getMaillotDecision(handle: string) {
  return MAILLOT_DECISIONS.find((item) => item.handle === handle);
}

export function getLongSleeveDecision(handle: string) {
  return LONG_SLEEVE_COMPARISON.find((item) => item.handle === handle);
}

export function getColdWeatherDecision(handle: string) {
  return [...THERMAL_COMPARISON, ...JACKET_COMPARISON].find(
    (item) => item.handle === handle
  );
}

export function getAccessoryDecision(handle: string) {
  return [
    ...VEST_COMPARISON,
    ...SHORT_BIB_COMPARISON,
    ...LONG_BIB_COMPARISON,
  ].find((item) => item.handle === handle);
}
