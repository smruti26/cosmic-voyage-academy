import { createFileRoute } from "@tanstack/react-router";
import { ClientCanvas } from "@/components/three/ClientCanvas";
import { StarField } from "@/components/three/StarField";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Route = createFileRoute("/isro")({
  head: () => ({
    meta: [
      { title: "ISRO Missions — Cosmoverse" },
      { name: "description", content: "From Aryabhata to Chandrayaan-3 and Aditya-L1 — explore India's most ambitious space missions in an interactive timeline." },
      { property: "og:title", content: "ISRO Missions — Cosmoverse" },
      { property: "og:description", content: "India's journey to the Moon, Mars and the Sun, told in 3D." },
    ],
  }),
  component: ISRO,
});

const MISSIONS = [
  { year: "1975", name: "Aryabhata", d: "India's first satellite, named after the 5th-century mathematician." },
  { year: "1980", name: "Rohini RS-1", d: "First Indian satellite launched by an Indian rocket (SLV-3)." },
  { year: "2008", name: "Chandrayaan-1", d: "India's first Moon mission. Discovered water molecules on the lunar surface." },
  { year: "2013", name: "Mangalyaan (MOM)", d: "Mars Orbiter Mission — India became the first country to reach Mars on its first try." },
  { year: "2017", name: "PSLV-C37", d: "Launched 104 satellites in a single mission — a world record at the time." },
  { year: "2019", name: "Chandrayaan-2", d: "Orbiter still studies the Moon; the lander attempt taught crucial lessons for the next mission." },
  { year: "2023", name: "Chandrayaan-3", d: "Vikram lander touched down near the Moon's south pole — a world first." },
  { year: "2023", name: "Aditya-L1", d: "India's first solar observatory, parked at Lagrange Point 1, 1.5 million km from Earth." },
  { year: "2025+", name: "Gaganyaan", d: "ISRO's upcoming human spaceflight programme — three astronauts to low Earth orbit." },
];

function Rocket3D() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.4;
      ref.current.position.y = Math.sin(s.clock.elapsedTime * 0.8) * 0.15;
    }
  });
  return (
    <group ref={ref}>
      {/* body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 1.8, 32]} />
        <meshStandardMaterial color="#e8ecf3" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* nose */}
      <mesh position={[0, 1.25, 0]}>
        <coneGeometry args={[0.35, 0.7, 32]} />
        <meshStandardMaterial color="#ff7a3c" emissive="#ff7a3c" emissiveIntensity={0.25} />
      </mesh>
      {/* fins */}
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((r, i) => (
        <mesh key={i} position={[0, -0.85, 0]} rotation={[0, r, 0]}>
          <boxGeometry args={[0.6, 0.35, 0.05]} />
          <meshStandardMaterial color="#ff7a3c" />
        </mesh>
      ))}
      {/* flame */}
      <mesh position={[0, -1.2, 0]}>
        <coneGeometry args={[0.3, 0.7, 24]} />
        <meshBasicMaterial color="#ffd27a" transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, -1.45, 0]}>
        <coneGeometry args={[0.18, 0.5, 24]} />
        <meshBasicMaterial color="#ff5a1a" transparent opacity={0.7} />
      </mesh>
      <pointLight position={[0, -1.3, 0]} intensity={3} color="#ffb15c" distance={5} />
      {/* logo stripe */}
      <mesh position={[0, 0.4, 0.36]}>
        <planeGeometry args={[0.5, 0.18]} />
        <meshBasicMaterial color="#ff7a3c" />
      </mesh>
    </group>
  );
}

function ISRO() {
  return (
    <div className="relative pt-32 pb-20">
      <section className="relative mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Chapter 05</p>
            <h1 className="mt-3 text-5xl md:text-6xl font-bold">
              <span className="text-aurora">ISRO</span><br />India in space
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              The Indian Space Research Organisation began in 1969 with a vision to use space for national development. Today it sends rockets to the Moon, Mars and the Sun — at a fraction of the cost of other space programmes.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                ["1969", "ISRO founded"],
                ["432+", "Satellites launched"],
                ["3", "Worlds reached"],
              ].map(([k, v]) => (
                <div key={k} className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-aurora">{k}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-square w-full glass rounded-3xl overflow-hidden">
            <ClientCanvas camera={{ position: [3.5, 1.2, 4.5], fov: 45 }} dpr={[1, 1.8]}>
              <color attach="background" args={["#06041a"]} />
              <ambientLight intensity={0.35} />
              <directionalLight position={[5, 5, 5]} intensity={1.2} />
              <StarField count={1200} radius={40} />
              <Rocket3D />
            </ClientCanvas>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-7xl px-6 mt-24">
        <h2 className="text-3xl md:text-4xl font-bold">Mission timeline</h2>
        <div className="mt-10 relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent" />
          <ul className="space-y-8">
            {MISSIONS.map((m, i) => (
              <li key={m.name} className={`relative md:grid md:grid-cols-2 md:gap-8 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="hidden md:block" />
                <div className="relative pl-12 md:pl-0">
                  <span className="absolute left-2.5 md:left-1/2 md:-translate-x-1/2 top-2 h-3 w-3 rounded-full bg-accent shadow-glow animate-pulse-glow" />
                  <div className={`glass rounded-2xl p-5 ${i % 2 ? "md:mr-8" : "md:ml-8"}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-primary">{m.year}</span>
                      <span className="text-lg font-semibold">{m.name}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{m.d}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
