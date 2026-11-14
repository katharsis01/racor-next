"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  ArrowRight,
  Check,
  Download,
  ImagePlus,
  Pause,
  Play,
  RotateCcw,
  Upload,
} from "lucide-react";

import {
  JERSEY_TEMPLATES,
  PRINT,
  drawTemplate,
  type TemplateId,
} from "@/lib/jersey-templates";
import { trackEvent } from "@/lib/analytics-events";
import { whatsAppLink } from "@/lib/whatsapp-summary";
import type { JerseyTextFont, ViewCommand } from "./morcuera-3d-scene";

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

const TEMPLATES = JERSEY_TEMPLATES;
const TEMPLATE_IDS = TEMPLATES.map((template) => template.id);
const STORAGE_KEY = "racor-morcuera-design-v2";
const LEGACY_STORAGE_KEY = "racor-morcuera-design-v1";

const STEPS = ["Diseño", "Colores", "Textos", "Logo", "Enviar"] as const;
type Step = (typeof STEPS)[number];

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

type PrintColor = {
  name: string;
  value: string;
};

const PRINT_COLORS: PrintColor[] = [
  { name: "Negro", value: "#111111" },
  { name: "Blanco", value: "#f4f1e8" },
  { name: "Rojo", value: "#d62828" },
  { name: "Coral", value: "#f25f52" },
  { name: "Naranja", value: "#f28c28" },
  { name: "Amarillo", value: "#f4d35e" },
  { name: "Lima", value: "#c4d600" },
  { name: "Verde", value: "#2a9d68" },
  { name: "Bosque", value: "#0c332c" },
  { name: "Turquesa", value: "#20b2aa" },
  { name: "Cielo", value: "#43a5d8" },
  { name: "Azul", value: "#1464a5" },
  { name: "Marino", value: "#12243a" },
  { name: "Morado", value: "#7767a8" },
  { name: "Rosa", value: "#e76f9a" },
  { name: "Gris", value: "#888888" },
];

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

type SavedDesign = {
  bodyColor?: string;
  sleeveColor?: string;
  trimColor?: string;
  template?: TemplateId;
  clubText?: string;
  backName?: string;
  backNumber?: string;
  textFont?: JerseyTextFont;
  textColor?: string;
  logo?: LogoState;
  logoX?: number;
  logoY?: number;
  logoScale?: number;
};

type DesignSnapshot = {
  bodyColor: string;
  sleeveColor: string;
  trimColor: string;
  template: TemplateId;
  clubText: string;
  backName: string;
  backNumber: string;
  textFont: JerseyTextFont;
  textColor: string;
  logo?: LogoState;
  logoX: number;
  logoY: number;
  logoScale: number;
};

const isHexColor = (value: unknown): value is string =>
  typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
const isTemplateId = (value: unknown): value is TemplateId =>
  typeof value === "string" && TEMPLATE_IDS.includes(value as TemplateId);
const isTextFont = (value: unknown): value is JerseyTextFont =>
  value === "deportiva" || value === "condensada" || value === "clasica";
const isSavedLogo = (value: unknown): value is LogoState => {
  if (!value || typeof value !== "object") return false;
  const logo = value as Partial<LogoState>;
  return (
    typeof logo.src === "string" &&
    logo.src.startsWith("data:image/") &&
    typeof logo.name === "string" &&
    logo.name.length <= 200 &&
    typeof logo.aspect === "number" &&
    Number.isFinite(logo.aspect) &&
    logo.aspect >= 0.45 &&
    logo.aspect <= 2.4
  );
};

function parseDesign(value: unknown, allowLogo: boolean): SavedDesign {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const input = value as Record<string, unknown>;
  const design: SavedDesign = {};
  if (isHexColor(input.bodyColor)) design.bodyColor = input.bodyColor;
  if (isHexColor(input.sleeveColor)) design.sleeveColor = input.sleeveColor;
  if (isHexColor(input.trimColor)) design.trimColor = input.trimColor;
  if (isTemplateId(input.template)) design.template = input.template;
  if (typeof input.clubText === "string" && input.clubText.length <= 18) {
    design.clubText = input.clubText;
  }
  if (typeof input.backName === "string" && input.backName.length <= 14) {
    design.backName = input.backName;
  }
  if (
    typeof input.backNumber === "string" &&
    /^\d{0,2}$/.test(input.backNumber) &&
    (input.backNumber === "" || Number(input.backNumber) <= 99)
  ) {
    design.backNumber = input.backNumber;
  }
  if (isTextFont(input.textFont)) design.textFont = input.textFont;
  if (input.textColor === "auto" || isHexColor(input.textColor)) {
    design.textColor = input.textColor;
  }
  if (typeof input.logoX === "number" && Number.isFinite(input.logoX) && input.logoX >= -0.72 && input.logoX <= 0.72) {
    design.logoX = input.logoX;
  }
  if (typeof input.logoY === "number" && Number.isFinite(input.logoY) && input.logoY >= -0.75 && input.logoY <= 0.82) {
    design.logoY = input.logoY;
  }
  if (typeof input.logoScale === "number" && Number.isFinite(input.logoScale) && input.logoScale >= 0.2 && input.logoScale <= 1.05) {
    design.logoScale = input.logoScale;
  }
  if (allowLogo && isSavedLogo(input.logo)) design.logo = input.logo;
  return design;
}

function encodeDesign(design: Omit<DesignSnapshot, "logo">) {
  const bytes = new TextEncoder().encode(JSON.stringify(design));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeDesign(encoded: string) {
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
}

function createShareUrl(design: Omit<DesignSnapshot, "logo">) {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.pathname, window.location.origin);
  url.searchParams.set("d", encodeDesign(design));
  return url.toString();
}

function loadInitialDesign(): SavedDesign {
  if (typeof window === "undefined") return {};
  const encoded = new URLSearchParams(window.location.search).get("d");
  if (encoded) {
    try {
      const shared = parseDesign(decodeDesign(encoded), false);
      if (Object.keys(shared).length) return shared;
    } catch {
      // Un enlace inválido no impide cargar el diseño local.
    }
  }

  for (const key of [STORAGE_KEY, LEGACY_STORAGE_KEY]) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) return parseDesign(JSON.parse(raw) as unknown, true);
    } catch {
      // Diseño guardado corrupto o localStorage inaccesible: se prueba la siguiente fuente.
    }
  }
  return {};
}

function TemplateThumbnail({
  template,
  colors,
}: {
  template: TemplateId;
  colors: { body: string; sleeves: string; trim: string };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { body, sleeves, trim } = colors;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) drawTemplate(context, template, { body, sleeves, trim });
  }, [template, body, sleeves, trim]);

  return (
    <canvas
      aria-hidden="true"
      className="h-24 w-full bg-neutral-100 object-cover"
      height={PRINT.size}
      ref={canvasRef}
      width={PRINT.size}
    />
  );
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
    <fieldset className="border-b border-neutral-200 py-4">
      <legend className="text-xs font-semibold uppercase tracking-[0.1em]">{label}</legend>
      <div className="mt-3 grid grid-cols-8 gap-x-1.5 gap-y-2.5 sm:grid-cols-8">
        {PRINT_COLORS.map((color) => (
          <button
            aria-label={color.name}
            aria-pressed={value.toLowerCase() === color.value}
            className={`mx-auto size-7 border border-neutral-300 transition-shadow ${
              value.toLowerCase() === color.value
                ? "ring-2 ring-racor ring-offset-2"
                : "hover:ring-1 hover:ring-neutral-500"
            }`}
            key={color.name}
            onClick={() => onChange(color.value)}
            style={{ backgroundColor: color.value }}
            title={color.name}
            type="button"
          />
        ))}
      </div>
      <label className="mt-3 flex min-h-10 items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
        Personalizado
        <span className="flex items-center gap-2">
          <span className="font-mono text-[10px]">{value.toUpperCase()}</span>
          <input
            aria-label={`Color personalizado de ${label.toLowerCase()}`}
            className="size-8 cursor-pointer border border-neutral-300 bg-transparent p-0.5"
            onChange={(event) => onChange(event.target.value)}
            type="color"
            value={value}
          />
        </span>
      </label>
    </fieldset>
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
  const [saved] = useState(loadInitialDesign);
  const [bodyColor, setBodyColor] = useState(saved.bodyColor ?? DEFAULT_PALETTE.body);
  const [sleeveColor, setSleeveColor] = useState(saved.sleeveColor ?? DEFAULT_PALETTE.sleeves);
  const [trimColor, setTrimColor] = useState(saved.trimColor ?? DEFAULT_PALETTE.trim);
  const [logo, setLogo] = useState<LogoState | undefined>(saved.logo);
  const [logoX, setLogoX] = useState(saved.logoX ?? -0.38);
  const [logoY, setLogoY] = useState(saved.logoY ?? 0.45);
  const [logoScale, setLogoScale] = useState(saved.logoScale ?? 0.52);
  const [template, setTemplate] = useState<TemplateId>(saved.template ?? "solido");
  const [clubText, setClubText] = useState(saved.clubText ?? "");
  const [backName, setBackName] = useState(saved.backName ?? "");
  const [backNumber, setBackNumber] = useState(saved.backNumber ?? "");
  const [textFont, setTextFont] = useState<JerseyTextFont>(saved.textFont ?? "deportiva");
  const [textColor, setTextColor] = useState(saved.textColor ?? "auto");
  const [step, setStep] = useState<Step>("Diseño");
  const [view, setView] = useState<ViewCommand>();
  const [autoRotate, setAutoRotate] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [copyState, setCopyState] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const shareInputRef = useRef<HTMLInputElement>(null);

  const design = useMemo<DesignSnapshot>(
    () => ({
      bodyColor,
      sleeveColor,
      trimColor,
      template,
      clubText,
      backName,
      backNumber,
      textFont,
      textColor,
      logo,
      logoX,
      logoY,
      logoScale,
    }),
    [
      bodyColor,
      sleeveColor,
      trimColor,
      template,
      clubText,
      backName,
      backNumber,
      textFont,
      textColor,
      logo,
      logoX,
      logoY,
      logoScale,
    ],
  );
  const shareUrl = useMemo(() => {
    const { logo: ignoredLogo, ...withoutLogo } = design;
    void ignoredLogo;
    return createShareUrl(withoutLogo);
  }, [design]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(design));
    } catch {
      try {
        const { logo: ignoredLogo, ...withoutLogo } = design;
        void ignoredLogo;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(withoutLogo));
      } catch {
        // localStorage no disponible: el diseño solo vive en la sesión.
      }
    }
  }, [design]);

  const templateLabel =
    TEMPLATES.find((item) => item.id === template)?.label ?? template;
  const proposalHref = useMemo(() => {
    const designText = [
      `plantilla ${templateLabel}`,
      `cuerpo ${bodyColor}`,
      `mangas ${sleeveColor}`,
      `cuello y cintura ${trimColor}`,
      logo ? `logo "${logo.name}"` : "sin logo",
      clubText.trim() ? `texto pecho "${clubText.trim()}"` : "sin texto pecho",
      `espalda "${backName.trim() || "—"} ${backNumber || "—"}"`,
    ].join(" · ");
    const params = new URLSearchParams({
      prenda: "Morcuera 2.0 personalizado",
      diseno: designText,
    });
    return `/contacto?${params.toString()}`;
  }, [templateLabel, bodyColor, sleeveColor, trimColor, logo, clubText, backName, backNumber]);

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
    setBackName("");
    setBackNumber("");
    setTextFont("deportiva");
    setTextColor("auto");
    setAutoRotate(false);
    setUploadError("");
    setCopyState("");
    setStep("Diseño");
    if (fileInputRef.current) fileInputRef.current.value = "";
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      const url = new URL(window.location.href);
      url.searchParams.delete("d");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    } catch {
      // El reinicio visual funciona aunque el navegador bloquee almacenamiento o historial.
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

  const createCurrentShareUrl = () => {
    return shareUrl;
  };

  const copyShareLink = async () => {
    const url = createCurrentShareUrl();
    setCopyState("");
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("Enlace copiado");
    } catch {
      const input = shareInputRef.current;
      if (input) {
        input.value = url;
        input.focus();
        input.select();
        setCopyState(
          document.execCommand("copy")
            ? "Enlace copiado"
            : "Selecciona el enlace para copiarlo",
        );
      }
    }
  };

  const colorName = (color: string) =>
    PRINT_COLORS.find((swatch) => swatch.value === color.toLowerCase())?.name ??
    color.toUpperCase();

  const whatsAppText = [
    "Hola RACOR, he diseñado mi Morcuera 2.0 en el configurador.",
    "",
    `Diseño: ${templateLabel}`,
    `Cuerpo: ${colorName(bodyColor)} · Mangas: ${colorName(sleeveColor)} · Detalles: ${colorName(trimColor)}`,
    `Texto pecho: ${clubText.trim() || "—"} · Espalda: ${backName.trim() || "—"} ${backNumber || "—"}`,
    `Logo: ${logo ? `${logo.name} (os lo adjunto aquí)` : "Sin logo"}`,
    "",
    `Ver diseño: ${createCurrentShareUrl()}`,
  ].join("\n");

  const handleWhatsAppClick = () => {
    trackEvent("chat_external_click", {
      destination: "whatsapp",
      page: window.location.pathname,
      product: "maillot-morcuera-2-0",
      summary: true,
    });
    void fetch("/api/chat-handoff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: whatsAppText,
        product: "maillot-morcuera-2-0",
      }),
      keepalive: true,
    }).catch(() => undefined);
  };

  const nextStep = () => {
    const currentIndex = STEPS.indexOf(step);
    setStep(STEPS[(currentIndex + 1) % STEPS.length]);
  };

  const templateColors = {
    body: bodyColor,
    sleeves: sleeveColor,
    trim: trimColor,
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
              backName={backName}
              backNumber={backNumber}
              bodyColor={bodyColor}
              clubText={clubText}
              logo={logo ? { aspect: logo.aspect, src: logo.src } : undefined}
              logoScale={logoScale}
              logoX={logoX}
              logoY={logoY}
              sleeveColor={sleeveColor}
              template={template}
              textColor={textColor}
              textFont={textFont}
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

        <div className="p-5 md:p-8 lg:max-h-[760px] lg:overflow-y-auto">
          <div className="border-b border-neutral-900 pb-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-racor">
              Configurador beta
            </p>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight">
              Diseña tu Morcuera
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Personaliza el diseño, los colores, los textos y el logo. La propuesta final
              siempre se revisará antes de producir.
            </p>
          </div>

          <div
            aria-label="Pasos del configurador"
            className="mt-5 grid grid-cols-5 border border-neutral-200"
            role="tablist"
          >
            {STEPS.map((item, index) => (
              <button
                aria-selected={step === item}
                className={`min-h-11 border-r border-neutral-200 px-1 text-[9px] font-semibold uppercase tracking-[0.04em] last:border-r-0 sm:text-[10px] ${
                  step === item
                    ? "bg-racor text-white"
                    : "text-neutral-500 transition-colors hover:text-neutral-950"
                }`}
                key={item}
                onClick={() => setStep(item)}
                role="tab"
                type="button"
              >
                <span className="block text-[8px] opacity-70">{index + 1}</span>
                {item}
              </button>
            ))}
          </div>

          {step === "Diseño" && (
            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-neutral-400">
                Elige tu diseño
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {TEMPLATES.map((item) => (
                  <button
                    aria-pressed={template === item.id}
                    className={`overflow-hidden border text-left transition-colors ${
                      template === item.id
                        ? "border-neutral-950 ring-1 ring-neutral-950"
                        : "border-neutral-200 hover:border-neutral-900"
                    }`}
                    key={item.id}
                    onClick={() => setTemplate(item.id)}
                    type="button"
                  >
                    <TemplateThumbnail colors={templateColors} template={item.id} />
                    <span className="block px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em]">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-neutral-400">
                Cada diseño se adapta a los colores elegidos para tu maillot.
              </p>
            </div>
          )}

          {step === "Colores" && (
            <div className="mt-6">
              <fieldset>
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
              <div className="mt-6 border-t border-neutral-200">
                <ColorControl label="Cuerpo" onChange={setBodyColor} value={bodyColor} />
                <ColorControl label="Mangas" onChange={setSleeveColor} value={sleeveColor} />
                <ColorControl label="Detalles · cuello y cintura" onChange={setTrimColor} value={trimColor} />
              </div>
            </div>
          )}

          {step === "Textos" && (
            <div className="mt-6 space-y-5">
              <fieldset>
                <legend className="text-[11px] font-semibold uppercase tracking-[0.13em] text-neutral-400">
                  Textos del maillot
                </legend>
                <label className="mt-3 block text-[10px] font-semibold uppercase tracking-[0.1em]">
                  Texto pecho
                  <input
                    aria-label="Texto en el pecho, por ejemplo el nombre de tu club"
                    className="mt-2 w-full border border-neutral-300 px-3 py-3 text-sm uppercase tracking-[0.06em] outline-none transition-colors placeholder:normal-case placeholder:text-neutral-400 focus:border-neutral-900"
                    maxLength={18}
                    onChange={(event) => setClubText(event.target.value)}
                    placeholder="Nombre de tu club (opcional)"
                    type="text"
                    value={clubText}
                  />
                </label>
                <label className="mt-4 block text-[10px] font-semibold uppercase tracking-[0.1em]">
                  Nombre espalda
                  <input
                    aria-label="Nombre en la espalda"
                    className="mt-2 w-full border border-neutral-300 px-3 py-3 text-sm uppercase tracking-[0.06em] outline-none transition-colors placeholder:normal-case placeholder:text-neutral-400 focus:border-neutral-900"
                    maxLength={14}
                    onChange={(event) => setBackName(event.target.value.slice(0, 14))}
                    placeholder="Nombre · máximo 14 caracteres"
                    type="text"
                    value={backName}
                  />
                </label>
                <label className="mt-4 block text-[10px] font-semibold uppercase tracking-[0.1em]">
                  Dorsal
                  <input
                    aria-label="Dorsal de 0 a 99"
                    className="mt-2 w-28 border border-neutral-300 px-3 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900"
                    inputMode="numeric"
                    maxLength={2}
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, "").slice(0, 2);
                      setBackNumber(
                        digits && Number(digits) > 99 ? "99" : digits,
                      );
                    }}
                    placeholder="0–99"
                    type="text"
                    value={backNumber}
                  />
                </label>
              </fieldset>

              <label className="block text-[10px] font-semibold uppercase tracking-[0.1em]">
                Tipografía
                <select
                  aria-label="Tipografía de los textos"
                  className="mt-2 min-h-11 w-full border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-900"
                  onChange={(event) => setTextFont(event.target.value as JerseyTextFont)}
                  value={textFont}
                >
                  <option value="deportiva">Deportiva</option>
                  <option value="condensada">Condensada</option>
                  <option value="clasica">Clásica</option>
                </select>
              </label>

              <fieldset>
                <legend className="text-[10px] font-semibold uppercase tracking-[0.1em]">
                  Color del texto
                </legend>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    aria-pressed={textColor === "auto"}
                    className={`min-h-9 border px-3 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                      textColor === "auto"
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : "border-neutral-300"
                    }`}
                    onClick={() => setTextColor("auto")}
                    type="button"
                  >
                    Auto
                  </button>
                  {PRINT_COLORS.map((color) => (
                    <button
                      aria-label={color.name}
                      aria-pressed={textColor.toLowerCase() === color.value}
                      className={`size-7 border border-neutral-300 ${
                        textColor.toLowerCase() === color.value
                          ? "ring-2 ring-racor ring-offset-2"
                          : ""
                      }`}
                      key={color.name}
                      onClick={() => setTextColor(color.value)}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                      type="button"
                    />
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {step === "Logo" && (
            <fieldset className="mt-6">
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
              <p className="mt-4 text-xs leading-relaxed text-neutral-400">
                Usa un archivo PNG, JPG o WEBP de hasta 4 MB. El logo se guarda en este
                dispositivo, pero no se incluye en el enlace compartido.
              </p>
            </fieldset>
          )}

          {step === "Enviar" && (
            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-neutral-400">
                Comparte y solicita tu propuesta
              </p>
              <div className="mt-4 grid gap-2">
                <button
                  className="inline-flex min-h-12 items-center justify-center gap-2 border border-neutral-300 px-5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors hover:border-neutral-900"
                  onClick={copyShareLink}
                  type="button"
                >
                  {copyState === "Enlace copiado" ? (
                    <Check className="size-4" />
                  ) : (
                    <ArrowRight className="size-4" />
                  )}
                  Copiar enlace del diseño
                </button>
                <input
                  aria-label="Enlace compartido del diseño"
                  className="w-full border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-[10px] text-neutral-500"
                  readOnly
                  ref={shareInputRef}
                  value={shareUrl}
                />
                {copyState && (
                  <p aria-live="polite" className="text-center text-xs text-racor">
                    {copyState}
                  </p>
                )}
                <a
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-racor px-5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-neutral-950"
                  href={whatsAppLink(whatsAppText)}
                  onClick={handleWhatsAppClick}
                  rel="noreferrer"
                  target="_blank"
                >
                  Enviar diseño por WhatsApp <ArrowRight className="size-4" />
                </a>
                <Link
                  className="inline-flex min-h-12 items-center justify-center gap-2 border border-neutral-300 px-5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors hover:border-neutral-900"
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
              </div>
              <p className="mt-4 text-center text-xs text-neutral-400">
                El diseño se guarda automáticamente en este dispositivo.
              </p>
            </div>
          )}

          <button
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-neutral-950 px-5 text-xs font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:bg-racor"
            onClick={nextStep}
            type="button"
          >
            Siguiente <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
