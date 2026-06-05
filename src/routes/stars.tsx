import { createFileRoute } from "@tanstack/react-router";
import { ClientCanvas } from "@/components/three/ClientCanvas";
import { StarField } from "@/components/three/StarField";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Route = createFileRoute("/stars")({
  head: () => ({
    meta: [
      { title: "Stars & Nebulae — Cosmoverse" },
      { name: "description", content: "From red dwarfs to blue supergiants — how stars are born in nebulae, live for billions of years, and die spectacularly." },
      { property: "og:title", content: "Stars & Nebulae — Cosmoverse" },
      { property: "og:description", content: "An immersive 3D tour of stars, constellations and nebulae." },
    ],
  }),
  component: Stars,
});

const STAR_TYPES = [
  { type: "O", color: "#9bb7ff", temp: "30,000+ K", life: "~10 Myr", note: "Brightest, hottest, bluest. Burn fast and die in supernovae." },
  { type: "B", color: "#bcd0ff", temp: "10–30k K",  life: "100 Myr",  note: "Blue-white giants like Rigel." },
  { type: "A", color: "#ffffff", temp: "7.5–10k K", life: "1 Gyr",    note: "White, like Sirius A." },
  { type: "F", color: "#fff4e5", temp: "6–7.5k K",  life: "3 Gyr",    note: "Yellow-white." },
  { type: "G", color: "#ffe9a6", temp: "5.2–6k K",  life: "10 Gyr",   note: "Our Sun lives here." },
  { type: "K", color: "#ffc28a", temp: "3.7–5.2k K",life: "50 Gyr",   note: "Orange, like Arcturus." },
  { type: "M", color: "#ff7a55", temp: "<3.7k K",   life: "100+ Gyr", note: "Red dwarfs — most common stars." },
];

const NEBULAE = [
  { n: "Orion Nebula", d: "A stellar nursery 1,344 light-years away where new stars ignite." },
  { n: "Eagle Nebula", d: "Home to the famous 'Pillars of Creation' captured by Hubble." },
  { n: "Crab Nebula", d: "The expanding remnant of a supernova seen by astronomers in 1054 CE." },
  { n: "Helix Nebula", d: "A dying Sun-like star puffing off its outer layers — 'the Eye of God'." },
];

function NebulaCloud() {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const n = 5000;
    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);
    const a = new THREE.Color("#ff6ab8");
    const b = new THREE.Color("#4d8bff");
    for (let i = 0; i < n; i++) {
      const r = Math.random() * 4;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      positions[i*3] = r * Math.sin(p) * Math.cos(t);
      positions[i*3+1] = r * Math.sin(p) * Math.sin(t) * 0.6;
      positions[i*3+2] = r * Math.cos(p);
      const c = a.clone().lerp(b, Math.random());
      colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
    }
    return { positions, colors };
  }, []);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.05; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} sizeAttenuation vertexColors transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Stars() {
  return (
    <div className="relative pt-32 pb-20">
      <section className="relative mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Chapter 04</p>
            <h1 className="mt-3 text-5xl md:text-6xl font-bold">Stars &amp; <span className="text-aurora">Nebulae</span></h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Stars are giant balls of glowing plasma, born inside colorful clouds of gas and dust called nebulae. Some live a few million years, others outlive the universe so far.
            </p>
          </div>
          <div className="relative aspect-square w-full glass rounded-3xl overflow-hidden">
            <ClientCanvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.8]}>
              <color attach="background" args={["#04020c"]} />
              <StarField count={1500} radius={40} />
              <NebulaCloud />
            </ClientCanvas>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 mt-20">
        <h2 className="text-3xl md:text-4xl font-bold">Stellar classification</h2>
        <p className="mt-2 text-muted-foreground max-w-xl">Astronomers sort stars by color and temperature using the letters O, B, A, F, G, K, M — from hottest to coolest.</p>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAR_TYPES.map((s) => (
            <div key={s.type} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full shadow-glow"
                      style={{ background: `radial-gradient(circle, white 0%, ${s.color} 60%, transparent 100%)` }} />
                <div>
                  <div className="text-2xl font-bold">{s.type}</div>
                  <div className="text-xs text-muted-foreground">{s.temp}</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{s.note}</p>
              <div className="mt-2 text-xs text-primary">Lifespan ~ {s.life}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 mt-20">
        <h2 className="text-3xl md:text-4xl font-bold">Famous nebulae</h2>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {NEBULAE.map((n) => (
            <div key={n.n} className="glass rounded-2xl p-5">
              <div className="text-lg font-semibold">{n.n}</div>
              <p className="mt-2 text-sm text-muted-foreground">{n.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
