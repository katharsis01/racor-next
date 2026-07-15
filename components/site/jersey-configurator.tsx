"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  ArrowRight,
  Download,
  ImagePlus,
  Pause,
  Play,
  RotateCcw,
  Upload,
} from "lucide-react";

import type { TemplateId, ViewCommand } from "./morcuera-3d-scene";

const Morcuera3DScene = dynamic(
  () =>
    import("./morcuera-3d-scene").then((module) => module.Morcuera3DScene),
  {
    loading: () => (
      <div className="grid h-full place-items-center bg-neutral-100 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
        Preparando vista 3D
      </div>
    ),
    ssr: false,
  },
);

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: "solido", label: "Sólido" },
  { id: "degradado", label: "Degradado" },
  { id: "bandas", label: "Bandas" },
  { id: "diagonal", label: "Diagonal" },
];

const TEMPLATE_IDS = TEMPLATES.map((template) => template.id);

const VIEWS: { label: string; azimuth: number }[] = [
  { label: "Frente", azimuth: 0 },
  { label: "Dcha", azimuth: Math.PI / 2 },
  { label: "Espalda", azimuth: Math.PI },
  { label: "Izda", azimuth: -Math.PI / 2 },
];

type LogoState = {
  src: string;
  name: string;
  aspect: number;
};

type Palette = {
  name: string;
  body: string;
  sleeves: string;
  trim: string;
};

const DEFAULT_PALETTE: Palette = {
  name: "Morcuera",
  body: "#f25f52",
  sleeves: "#ff8a68",
  trim: "#f43f5e",
};

const PALETTES: Palette[] = [
  DEFAULT_PALETTE,
  { name: "Bosque", body: "#0c332c", sleeves: "#275d51", trim: "#f4f1e8" },
  { name: "Lavanda", body: "#7767a8", sleeves: "#a899d0", trim: "#f4f1e8" },
  { name: "Carrera", body: "#111111", sleeves: "#303030", trim: "#e6ff3f" },
];

const STORAGE_KEY = "racor-morcuera-design-v1";

type SavedDesign = {
  bodyColor: string;
  sleeveColor: string;
  trimColor: string;
  template?: TemplateId;
  clubText?: string;
  logo?: LogoState;
  logoX: number;
  logoY: number;
  logoScale: number;
};

const isHexColor = (value: unknown): value is string =>
  typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);

const isSavedLogo = (value: SavedDesign["logo"]): value is LogoState =>
  Boolean(
    value &&
      typeof value.src === "string" &&
      value.src.startsWith("data:image/") &&
      typeof value.name === "string" &&
      typeof value.aspect === "number",
  );

function loadSavedDesign(): Partial<SavedDesign> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const saved = JSON.parse(raw) as Partial<SavedDesign> | null;
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    // Diseño guardado corrupto o localStorage inaccesible: se parte del diseño base.
    return {};
  }
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 border-b border-neutral-200 py-3">
      <span className="text-xs font-semibold uppercase tracking-[0.1em]">{label}</span>
      <span className="flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase text-neutral-400">{value}</span>
        <input
          aria-label={`Color de ${label.toLowerCase()}`}
          className="size-9 cursor-pointer border border-neutral-300 bg-transparent p-0.5"
          onChange={(event) => onChange(event.target.value)}
          type="color"
          value={value}
        />
      </span>
    </label>
  );
}

function RangeControl({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block py-2.5">
      <span className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.1em]">
        {label}
        <span className="font-mono text-neutral-400">{value.toFixed(2)}</span>
      </span>
      <input
        className="h-1.5 w-full cursor-pointer accent-racor"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
}

export function JerseyConfigurator() {
  // Se renderiza solo en cliente (ssr: false), así que podemos leer localStorage al inicializar.
  const [saved] = useState(loadSavedDesign);
  const [bodyColor, setBodyColor] = useState(
    isHexColor(saved.bodyColor) ? saved.bodyColor : DEFAULT_PALETTE.body,
  );
  const [sleeveColor, setSleeveColor] = useState(
    isHexColor(saved.sleeveColor) ? saved.sleeveColor : DEFAULT_PALETTE.sleeves,
  );
  const [trimColor, setTrimColor] = useState(
    isHexColor(saved.trimColor) ? saved.trimColor : DEFAULT_PALETTE.trim,
  );
  const [logo, setLogo] = useState<LogoState | undefined>(
    isSavedLogo(saved.logo) ? saved.logo : undefined,
  );
  const [logoX, setLogoX] = useState(
    typeof saved.logoX === "number" ? saved.logoX : -0.38,
  );
  const [logoY, setLogoY] = useState(
    typeof saved.logoY === "number" ? saved.logoY : 0.45,
  );
  const [logoScale, setLogoScale] = useState(
    typeof saved.logoScale === "number" ? saved.logoScale : 0.52,
  );
  const [template, setTemplate] = useState<TemplateId>(
    saved.template && TEMPLATE_IDS.includes(saved.template)
      ? saved.template
      : "solido",
  );
  const [clubText, setClubText] = useState(
    typeof saved.clubText === "string" ? saved.clubText.slice(0, 18) : "",
  );
  const [view, setView] = useState<ViewCommand>();
  const [autoRotate, setAutoRotate] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const design: SavedDesign = {
      bodyColor,
      sleeveColor,
      trimColor,
      template,
      clubText,
      logo,
      logoX,
      logoY,
      logoScale,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(design));
    } catch {
      // Sin espacio (el logo puede ocupar varios MB): guardamos al menos los colores.
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...design, logo: undefined }),
        );
      } catch {
        // localStorage no disponible: el diseño solo vive en la sesión.
      }
    }
  }, [bodyColor, sleeveColor, trimColor, template, clubText, logo, logoX, logoY, logoScale]);

  const proposalHref = useMemo(() => {
    const templateLabel =
      TEMPLATES.find((item) => item.id === template)?.label ?? template;
    const design = [
      `plantilla ${templateLabel}`,
      `cuerpo ${bodyColor}`,
      `mangas ${sleeveColor}`,
      `cuello y cintura ${trimColor}`,
      logo ? `logo "${logo.name}"` : "sin logo",
      clubText.trim() ? `texto "${clubText.trim()}"` : "sin texto",
    ].join(" · ");
    const params = new URLSearchParams({
      prenda: "Morcuera 2.0 personalizado",
      diseno: design,
    });
    return `/contacto?${params.toString()}`;
  }, [bodyColor, sleeveColor, trimColor, template, clubText, logo]);

  const downloadSnapshot = () => {
    const canvas = sceneRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "morcuera-2-0-diseno.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const applyPalette = (palette: Palette) => {
    setBodyColor(palette.body);
    setSleeveColor(palette.sleeves);
    setTrimColor(palette.trim);
  };

  const reset = () => {
    applyPalette(DEFAULT_PALETTE);
    setLogo(undefined);
    setLogoX(-0.38);
    setLogoY(0.45);
    setLogoScale(0.52);
    setTemplate("solido");
    setClubText("");
    setAutoRotate(false);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Sin acceso a localStorage: no hay nada guardado que borrar.
    }
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Usa un archivo PNG, JPG o WEBP.");
      event.target.value = "";
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("El logo no puede superar 4 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const src = reader.result;
      const preview = new window.Image();
      preview.onload = () => {
        const aspect = Math.min(2.4, Math.max(0.45, preview.width / preview.height));
        setLogo({ aspect, name: file.name, src });
        setUploadError("");
      };
      preview.onerror = () => setUploadError("No se ha podido leer el logo.");
      preview.src = src;
    };
    reader.onerror = () => setUploadError("No se ha podido leer el logo.");
    reader.readAsDataURL(file);
  };

  return (
    <section className="px-5 pb-20 md:px-12 md:pb-28 lg:px-16">
      <div className="mx-auto grid max-w-[1500px] overflow-hidden border border-neutral-200 bg-white lg:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.55fr)]">
        <div className="relative min-h-[520px] border-b border-neutral-200 lg:min-h-[760px] lg:border-r lg:border-b-0">
          <div
            aria-label="Vista tridimensional interactiva del maillot Morcuera 2.0"
            className="absolute inset-0"
            ref={sceneRef}
            role="img"
          >
            <Morcuera3DScene
              autoRotate={autoRotate}
              bodyColor={bodyColor}
              clubText={clubText}
              logo={logo ? { aspect: logo.aspect, src: logo.src } : undefined}
              logoScale={logoScale}
              logoX={logoX}
              logoY={logoY}
              sleeveColor={sleeveColor}
              template={template}
              trimColor={trimColor}
              view={view}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 border border-neutral-300 bg-white/90 backdrop-blur">
            {VIEWS.map((item) => (
              <button
                className="min-h-10 border-r border-neutral-300 px-3.5 text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors last:border-r-0 hover:bg-neutral-950 hover:text-white"
                key={item.label}
                onClick={() =>
                  setView((current) => ({
                    azimuth: item.azimuth,
                    seq: (current?.seq ?? 0) + 1,
                  }))
                }
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pointer-events-none absolute top-4 left-4 border border-neutral-900/15 bg-white/90 px-3 py-2 backdrop-blur">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Prototipo visual
            </p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.08em]">
              Arrastra para girar · Rueda para acercar
            </p>
          </div>

          <button
            aria-pressed={autoRotate}
            className="absolute right-4 bottom-4 inline-flex min-h-11 items-center gap-2 border border-neutral-300 bg-white/90 px-4 text-[10px] font-semibold uppercase tracking-[0.12em] backdrop-blur transition-colors hover:border-neutral-900"
            onClick={() => setAutoRotate((value) => !value)}
            type="button"
          >
            {autoRotate ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            {autoRotate ? "Pausar giro" : "Activar giro"}
          </button>
        </div>

        <div className="p-6 md:p-8 lg:max-h-[760px] lg:overflow-y-auto">
          <div className="border-b border-neutral-900 pb-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-racor">
              Configurador beta · Paso 1
            </p>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight">
              Diseña tu Morcuera
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Prueba colores y coloca el escudo de tu equipo. La propuesta final siempre se revisará antes de producir.
            </p>
          </div>

          <fieldset className="mt-7">
            <legend className="text-[11px] font-semibold uppercase tracking-[0.13em] text-neutral-400">
              Combinaciones rápidas
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {PALETTES.map((palette) => (
                <button
                  className="flex min-h-11 items-center gap-2 border border-neutral-200 px-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors hover:border-neutral-900"
                  key={palette.name}
                  onClick={() => applyPalette(palette)}
                  type="button"
                >
                  <span className="flex" aria-hidden="true">
                    {[palette.body, palette.sleeves, palette.trim].map((color) => (
                      <span
                        className="size-4 border border-black/10"
                        key={color}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>
                  {palette.name}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-7">
            <legend className="text-[11px] font-semibold uppercase tracking-[0.13em] text-neutral-400">
              Plantilla de diseño
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {TEMPLATES.map((item) => (
                <button
                  aria-pressed={template === item.id}
                  className={`flex min-h-11 items-center justify-center border px-3 text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                    template === item.id
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-200 hover:border-neutral-900"
                  }`}
                  key={item.id}
                  onClick={() => setTemplate(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-neutral-400">
              La plantilla usa los colores de cuerpo, mangas y cuello.
            </p>
          </fieldset>

          <fieldset className="mt-7">
            <legend className="text-[11px] font-semibold uppercase tracking-[0.13em] text-neutral-400">
              Colores por zona
            </legend>
            <div className="mt-1 border-t border-neutral-200">
              <ColorControl label="Cuerpo" onChange={setBodyColor} value={bodyColor} />
              <ColorControl label="Mangas" onChange={setSleeveColor} value={sleeveColor} />
              <ColorControl label="Cuello y cintura" onChange={setTrimColor} value={trimColor} />
            </div>
          </fieldset>

          <fieldset className="mt-7">
            <legend className="text-[11px] font-semibold uppercase tracking-[0.13em] text-neutral-400">
              Logo frontal
            </legend>
            <label className="mt-3 flex min-h-14 cursor-pointer items-center justify-center gap-2 border border-dashed border-neutral-400 px-4 text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors hover:border-neutral-900 hover:bg-neutral-50">
              {logo ? <ImagePlus className="size-4" /> : <Upload className="size-4" />}
              {logo ? "Cambiar logo" : "Subir PNG, JPG o WEBP"}
              <input
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={handleLogoUpload}
                ref={fileInputRef}
                type="file"
              />
            </label>
            {logo && (
              <p className="mt-2 truncate text-xs text-neutral-500">{logo.name}</p>
            )}
            {uploadError && (
              <p className="mt-2 text-xs text-red-700" role="alert">
                {uploadError}
              </p>
            )}

            {logo && (
              <div className="mt-4 border-t border-neutral-200 pt-2">
                <RangeControl
                  label="Horizontal"
                  max={0.72}
                  min={-0.72}
                  onChange={setLogoX}
                  step={0.02}
                  value={logoX}
                />
                <RangeControl
                  label="Vertical"
                  max={0.82}
                  min={-0.75}
                  onChange={setLogoY}
                  step={0.02}
                  value={logoY}
                />
                <RangeControl
                  label="Tamaño"
                  max={1.05}
                  min={0.2}
                  onChange={setLogoScale}
                  step={0.01}
                  value={logoScale}
                />
              </div>
            )}
          </fieldset>

          <fieldset className="mt-7">
            <legend className="text-[11px] font-semibold uppercase tracking-[0.13em] text-neutral-400">
              Texto en el pecho
            </legend>
            <input
              aria-label="Texto en el pecho, por ejemplo el nombre de tu club"
              className="mt-3 w-full border border-neutral-300 px-3 py-3 text-sm uppercase tracking-[0.06em] outline-none transition-colors placeholder:normal-case placeholder:text-neutral-400 focus:border-neutral-900"
              maxLength={18}
              onChange={(event) => setClubText(event.target.value)}
              placeholder="Nombre de tu club (opcional)"
              type="text"
              value={clubText}
            />
          </fieldset>

          <div className="mt-8 grid gap-2">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-racor px-5 text-xs font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:bg-neutral-950"
              href={proposalHref}
            >
              Solicitar propuesta <ArrowRight className="size-4" />
            </Link>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-neutral-300 px-5 text-[10px] font-semibold uppercase tracking-[0.11em] transition-colors hover:border-neutral-900"
              onClick={downloadSnapshot}
              type="button"
            >
              <Download className="size-3.5" /> Descargar diseño (PNG)
            </button>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-neutral-300 px-5 text-[10px] font-semibold uppercase tracking-[0.11em] transition-colors hover:border-neutral-900"
              onClick={reset}
              type="button"
            >
              <RotateCcw className="size-3.5" /> Restablecer diseño
            </button>
            <p className="mt-1 text-center text-xs text-neutral-400">
              Tu diseño se guarda automáticamente en este dispositivo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
