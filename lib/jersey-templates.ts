export type TemplateId =
  | "solido"
  | "degradado"
  | "bandas"
  | "diagonal"
  | "etapa"
  | "puerto"
  | "cuadros"
  | "rayas";

export const JERSEY_TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: "solido", label: "Sólido" },
  { id: "degradado", label: "Degradado" },
  { id: "bandas", label: "Bandas" },
  { id: "diagonal", label: "Diagonal" },
  { id: "etapa", label: "Etapa" },
  { id: "puerto", label: "Puerto" },
  { id: "cuadros", label: "Cuadros" },
  { id: "rayas", label: "Rayas" },
];

export const PRINT = {
  minX: -1.35,
  maxX: 1.35,
  minY: -2.1,
  maxY: 1.9,
  size: 512,
};

export function drawTemplate(
  ctx: CanvasRenderingContext2D,
  template: TemplateId,
  colors: { body: string; sleeves: string; trim: string },
) {
  const { size } = PRINT;
  const width = PRINT.maxX - PRINT.minX;
  const height = PRINT.maxY - PRINT.minY;
  const toX = (x: number) => ((x - PRINT.minX) / width) * size;
  const toY = (y: number) => ((PRINT.maxY - y) / height) * size;

  ctx.fillStyle = colors.body;
  ctx.fillRect(0, 0, size, size);

  if (template === "degradado") {
    const gradient = ctx.createLinearGradient(0, toY(0.9), 0, toY(-2.1));
    gradient.addColorStop(0, colors.body);
    gradient.addColorStop(1, colors.sleeves);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, toY(0.9), size, size - toY(0.9));
  } else if (template === "bandas") {
    ctx.fillStyle = colors.sleeves;
    for (let i = 0; i < 8; i++) {
      const y = -1.7 + i * 0.34;
      const bandHeight = (toY(0) - toY(0.09)) * (1 - i / 10);
      ctx.globalAlpha = 1 - i / 9;
      ctx.fillRect(0, toY(y), size, bandHeight);
    }
    ctx.globalAlpha = 1;
  } else if (template === "diagonal") {
    ctx.fillStyle = colors.sleeves;
    ctx.beginPath();
    ctx.moveTo(toX(-1.35), toY(-0.6));
    ctx.lineTo(toX(1.35), toY(-1.6));
    ctx.lineTo(toX(1.35), toY(-2.1));
    ctx.lineTo(toX(-1.35), toY(-2.1));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = colors.trim;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(toX(-1.35), toY(-0.45));
    ctx.lineTo(toX(1.35), toY(-1.45));
    ctx.stroke();
  } else if (template === "etapa") {
    ctx.fillStyle = colors.sleeves;
    ctx.beginPath();
    ctx.moveTo(toX(-1.35), toY(0.45));
    ctx.lineTo(toX(0), toY(-0.28));
    ctx.lineTo(toX(1.35), toY(0.45));
    ctx.lineTo(toX(1.35), toY(0.13));
    ctx.lineTo(toX(0), toY(-0.59));
    ctx.lineTo(toX(-1.35), toY(0.13));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = colors.trim;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(toX(-1.35), toY(0.1));
    ctx.lineTo(toX(0), toY(-0.62));
    ctx.lineTo(toX(1.35), toY(0.1));
    ctx.stroke();
  } else if (template === "puerto") {
    ctx.fillStyle = colors.sleeves;
    ctx.beginPath();
    ctx.moveTo(toX(-1.35), toY(-1.02));
    ctx.lineTo(toX(-0.92), toY(-0.79));
    ctx.lineTo(toX(-0.58), toY(-1.08));
    ctx.lineTo(toX(-0.12), toY(-0.55));
    ctx.lineTo(toX(0.18), toY(-0.87));
    ctx.lineTo(toX(0.55), toY(-0.62));
    ctx.lineTo(toX(0.86), toY(-0.94));
    ctx.lineTo(toX(1.35), toY(-0.7));
    ctx.lineTo(toX(1.35), toY(-2.1));
    ctx.lineTo(toX(-1.35), toY(-2.1));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = colors.trim;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(toX(-1.35), toY(-1.02));
    ctx.lineTo(toX(-0.92), toY(-0.79));
    ctx.lineTo(toX(-0.58), toY(-1.08));
    ctx.lineTo(toX(-0.12), toY(-0.55));
    ctx.lineTo(toX(0.18), toY(-0.87));
    ctx.lineTo(toX(0.55), toY(-0.62));
    ctx.lineTo(toX(0.86), toY(-0.94));
    ctx.lineTo(toX(1.35), toY(-0.7));
    ctx.stroke();
  } else if (template === "cuadros") {
    const columns = 12;
    const rows = 7;
    const cellWidth = size / columns;
    const cellHeight = (toY(-2.1) - toY(-1.05)) / rows;
    ctx.fillStyle = colors.sleeves;
    for (let row = 0; row < rows; row++) {
      ctx.globalAlpha = 0.92 - row * 0.105;
      for (let column = 0; column < columns; column++) {
        if ((row + column) % 2 === 0 || row < 2) {
          ctx.fillRect(
            column * cellWidth,
            toY(-2.1) - (row + 1) * cellHeight,
            cellWidth,
            cellHeight,
          );
        }
      }
    }
    ctx.globalAlpha = 1;
  } else if (template === "rayas") {
    ctx.fillStyle = colors.sleeves;
    ctx.globalAlpha = 0.58;
    for (let x = toX(-1.3); x < size; x += 28) {
      ctx.fillRect(x, toY(1.15), 5, size - toY(1.15));
    }
    ctx.globalAlpha = 1;
  }
}
