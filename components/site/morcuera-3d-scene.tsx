"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ReactNode, RefObject } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  Decal,
  Edges,
  Environment,
  Lightformer,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";

export type TemplateId = "solido" | "degradado" | "bandas" | "diagonal";

export type ViewCommand = {
  azimuth: number;
  seq: number;
};

export type MorcueraSceneProps = {
  bodyColor: string;
  sleeveColor: string;
  trimColor: string;
  autoRotate: boolean;
  template: TemplateId;
  clubText: string;
  view?: ViewCommand;
  logo?: {
    src: string;
    aspect: number;
  };
  logoX: number;
  logoY: number;
  logoScale: number;
};

const EXTRUDE_OPTIONS: THREE.ExtrudeGeometryOptions = {
  depth: 0.38,
  bevelEnabled: true,
  bevelSegments: 5,
  bevelSize: 0.08,
  bevelThickness: 0.08,
  curveSegments: 32,
  steps: 2,
};

function createTorsoShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-1.03, -1.82);
  shape.bezierCurveTo(-1.12, -1.2, -1.1, -0.2, -1.25, 0.78);
  shape.quadraticCurveTo(-1.3, 1.18, -0.98, 1.43);
  shape.lineTo(-0.48, 1.78);
  shape.quadraticCurveTo(-0.31, 1.37, 0, 1.34);
  shape.quadraticCurveTo(0.31, 1.37, 0.48, 1.78);
  shape.lineTo(0.98, 1.43);
  shape.quadraticCurveTo(1.3, 1.18, 1.25, 0.78);
  shape.bezierCurveTo(1.1, -0.2, 1.12, -1.2, 1.03, -1.82);
  shape.quadraticCurveTo(0, -1.96, -1.03, -1.82);
  shape.closePath();
  return shape;
}

// Área de dibujo de la "sublimación" del torso, en coordenadas de la forma
// (x -1.35..1.35, y -2.1..1.9). El canvas se mapea a este rectángulo vía UV.
const PRINT = { minX: -1.35, maxX: 1.35, minY: -2.1, maxY: 1.9, size: 512 };

function drawTemplate(
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
    // Bandas que se desvanecen hacia el pecho, al estilo "fade" de competición.
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
  }
}

function useTorsoPrintTexture(
  template: TemplateId,
  body: string,
  sleeves: string,
  trim: string,
) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = PRINT.size;
    canvas.height = PRINT.size;
    const ctx = canvas.getContext("2d");
    if (ctx) drawTemplate(ctx, template, { body, sleeves, trim });
    const nextTexture = new THREE.CanvasTexture(canvas);
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    // ExtrudeGeometry usa las coordenadas de la forma como UV: se remapean al 0..1.
    const width = PRINT.maxX - PRINT.minX;
    const height = PRINT.maxY - PRINT.minY;
    nextTexture.repeat.set(1 / width, 1 / height);
    nextTexture.offset.set(-PRINT.minX / width, -PRINT.minY / height);
    nextTexture.wrapS = THREE.ClampToEdgeWrapping;
    nextTexture.wrapT = THREE.ClampToEdgeWrapping;
    return nextTexture;
  }, [template, body, sleeves, trim]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function createSleeveShape(side: -1 | 1) {
  const shape = new THREE.Shape();
  const x = (value: number) => value * side;

  shape.moveTo(x(0.91), 1.44);
  shape.quadraticCurveTo(x(1.45), 1.4, x(1.92), 1.08);
  shape.quadraticCurveTo(x(2.18), 0.88, x(2.22), 0.54);
  shape.lineTo(x(2.4), -0.58);
  shape.quadraticCurveTo(x(1.98), -0.72, x(1.55), -0.75);
  shape.lineTo(x(1.32), 0.42);
  shape.quadraticCurveTo(x(1.27), 0.84, x(0.91), 1.44);
  shape.closePath();
  return shape;
}

function GarmentPiece({
  shape,
  color,
  map,
  children,
}: {
  shape: THREE.Shape;
  color: string;
  map?: THREE.Texture;
  children?: ReactNode;
}) {
  return (
    <mesh castShadow position={[0, 0, -0.19]}>
      <extrudeGeometry args={[shape, EXTRUDE_OPTIONS]} />
      {/* sheen: reflejo suave típico de tejidos, evita el aspecto plástico. */}
      <meshPhysicalMaterial
        color={map ? "#ffffff" : color}
        map={map ?? null}
        metalness={0.02}
        roughness={0.86}
        sheen={0.55}
        sheenRoughness={0.6}
      />
      <Edges
        color="#111111"
        opacity={0.24}
        scale={1.003}
        threshold={28}
        transparent
      />
      {children}
    </mesh>
  );
}

function ClubTextDecal({ text, color }: { text: string; color: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "700 130px 'Helvetica Neue', Helvetica, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;
      ctx.fillText(text.toUpperCase(), 512, 138, 980);
    }
    const nextTexture = new THREE.CanvasTexture(canvas);
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    return nextTexture;
  }, [text, color]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <Decal position={[0, -0.2, 0.46]} rotation={[0, 0, 0]} scale={[1.7, 0.425, 0.5]}>
      <meshBasicMaterial
        alphaTest={0.05}
        depthWrite={false}
        map={texture}
        polygonOffset
        polygonOffsetFactor={-4}
        toneMapped={false}
        transparent
      />
    </Decal>
  );
}

function UploadedLogo({
  src,
  aspect,
  x,
  y,
  scale,
}: {
  src: string;
  aspect: number;
  x: number;
  y: number;
  scale: number;
}) {
  const sourceTexture = useTexture(src);
  const texture = useMemo(() => {
    const nextTexture = sourceTexture.clone();
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.needsUpdate = true;
    return nextTexture;
  }, [sourceTexture]);

  useEffect(() => () => texture.dispose(), [texture]);

  // Decal: proyecta el logo sobre la superficie de la prenda, siguiendo su curvatura.
  // La cara frontal del torso queda en z ≈ 0.46 local (extrusión 0.38 + bisel 0.08).
  return (
    <Decal position={[x, y, 0.46]} rotation={[0, 0, 0]} scale={[scale * aspect, scale, 0.6]}>
      <meshBasicMaterial
        alphaTest={0.08}
        depthWrite={false}
        map={texture}
        polygonOffset
        polygonOffsetFactor={-4}
        transparent
        toneMapped={false}
      />
    </Decal>
  );
}

// Color de texto legible sobre el color base de la prenda.
function contrastColor(hex: string) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 140 ? "#111111" : "#ffffff";
}

function MorcueraModel({
  bodyColor,
  sleeveColor,
  trimColor,
  template,
  clubText,
  logo,
  logoX,
  logoY,
  logoScale,
}: Omit<MorcueraSceneProps, "autoRotate" | "view">) {
  const torsoShape = useMemo(() => createTorsoShape(), []);
  const leftSleeveShape = useMemo(() => createSleeveShape(-1), []);
  const rightSleeveShape = useMemo(() => createSleeveShape(1), []);
  const printTexture = useTorsoPrintTexture(
    template,
    bodyColor,
    sleeveColor,
    trimColor,
  );
  const trimmedText = clubText.trim();

  return (
    <group rotation={[0.03, 0, 0]}>
      <GarmentPiece color={bodyColor} map={printTexture} shape={torsoShape}>
        {logo && (
          <UploadedLogo
            aspect={logo.aspect}
            scale={logoScale}
            src={logo.src}
            x={logoX}
            y={logoY}
          />
        )}
        {trimmedText && (
          <ClubTextDecal color={contrastColor(bodyColor)} text={trimmedText} />
        )}
      </GarmentPiece>
      <GarmentPiece color={sleeveColor} shape={leftSleeveShape} />
      <GarmentPiece color={sleeveColor} shape={rightSleeveShape} />

      <mesh position={[0, 1.53, 0]} scale={[1, 0.62, 1]}>
        <torusGeometry args={[0.43, 0.075, 20, 64]} />
        <meshPhysicalMaterial color={trimColor} roughness={0.78} sheen={0.5} sheenRoughness={0.65} />
      </mesh>

      <mesh position={[0, -1.79, 0]}>
        <boxGeometry args={[2.02, 0.18, 0.46]} />
        <meshPhysicalMaterial color={trimColor} roughness={0.8} sheen={0.5} sheenRoughness={0.65} />
      </mesh>

      <mesh position={[0, -0.18, 0.218]}>
        <boxGeometry args={[0.026, 3.1, 0.02]} />
        <meshStandardMaterial color="#171717" roughness={0.65} />
      </mesh>
    </group>
  );
}

function ResponsiveGarment(
  props: Omit<MorcueraSceneProps, "autoRotate" | "view">,
) {
  const viewportWidth = useThree((state) => state.viewport.width);
  const scale = Math.min(1, Math.max(0.54, (viewportWidth - 0.35) / 5.05));

  return (
    <group scale={scale}>
      <MorcueraModel {...props} />
      <mesh position={[0, -2.2, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 7]} />
        <shadowMaterial color="#111111" opacity={0.2} transparent />
      </mesh>
    </group>
  );
}

// Coloca la cámara en el acimut pedido (frente, espalda, laterales) conservando
// la distancia actual, cada vez que cambia view.seq.
function ViewPresetController({
  view,
  controlsRef,
}: {
  view?: ViewCommand;
  controlsRef: RefObject<OrbitControlsImpl | null>;
}) {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    if (!view) return;
    const controls = controlsRef.current;
    const target = controls?.target ?? new THREE.Vector3(0, 0, 0);
    const distance = camera.position.distanceTo(target);
    camera.position.set(
      target.x + Math.sin(view.azimuth) * distance,
      camera.position.y,
      target.z + Math.cos(view.azimuth) * distance,
    );
    camera.lookAt(target);
    controls?.update();
    // Solo debe ejecutarse cuando llega una orden nueva (seq).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view?.seq]);

  return null;
}

export function Morcuera3DScene(props: MorcueraSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <Canvas
      camera={{ fov: 33, position: [0, 0.05, 8] }}
      dpr={[1, 2]}
      fallback={
        <div className="grid h-full place-items-center bg-neutral-100 px-8 text-center text-sm text-neutral-500">
          Este dispositivo no puede mostrar la vista 3D.
        </div>
      }
      gl={{
        alpha: false,
        antialias: true,
        powerPreference: "high-performance",
        // Necesario para poder exportar la vista como PNG con toDataURL.
        preserveDrawingBuffer: true,
      }}
      shadows="soft"
    >
      <color attach="background" args={["#f4f4f2"]} />
      {/* "Estudio fotográfico" procedural: softboxes sin descargar HDRIs externos. */}
      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={5}
          position={[0, 2.5, 6]}
          scale={[7, 4, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={3.2}
          position={[-6, 2, 1]}
          scale={[4, 3, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={3.2}
          position={[6, 2, 1]}
          scale={[4, 3, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="ring"
          intensity={2}
          position={[0, 6, 0]}
          scale={[6, 6, 1]}
          target={[0, 0, 0]}
        />
      </Environment>
      <ambientLight intensity={0.6} />
      {/* Luz clave: aporta la sombra proyectada (PCSS via shadows="soft"). */}
      <directionalLight
        castShadow
        intensity={1.1}
        position={[3.5, 6, 4]}
        shadow-mapSize={[1024, 1024]}
        shadow-radius={8}
      />

      <ResponsiveGarment
        bodyColor={props.bodyColor}
        clubText={props.clubText}
        logo={props.logo}
        logoScale={props.logoScale}
        logoX={props.logoX}
        logoY={props.logoY}
        sleeveColor={props.sleeveColor}
        template={props.template}
        trimColor={props.trimColor}
      />
      <ViewPresetController controlsRef={controlsRef} view={props.view} />
      <OrbitControls
        autoRotate={props.autoRotate}
        autoRotateSpeed={0.45}
        enablePan={false}
        maxDistance={9.4}
        maxPolarAngle={Math.PI * 0.72}
        minDistance={6.2}
        minPolarAngle={Math.PI * 0.28}
        ref={controlsRef}
      />
    </Canvas>
  );
}
