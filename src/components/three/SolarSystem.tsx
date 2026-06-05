import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PlanetCfg {
  name: string;
  color: string;
  size: number;
  distance: number;
  speed: number;
  ring?: { inner: number; outer: number; color: string };
}

const PLANETS: PlanetCfg[] = [
  { name: "Mercury", color: "#b1aca5", size: 0.18, distance: 2.2, speed: 0.55 },
  { name: "Venus",   color: "#e8b07a", size: 0.28, distance: 2.9, speed: 0.42 },
  { name: "Earth",   color: "#3a8dff", size: 0.30, distance: 3.7, speed: 0.34 },
  { name: "Mars",    color: "#d2532f", size: 0.24, distance: 4.5, speed: 0.27 },
  { name: "Jupiter", color: "#d8a872", size: 0.65, distance: 5.9, speed: 0.18 },
  { name: "Saturn",  color: "#e6c98a", size: 0.55, distance: 7.4, speed: 0.14, ring: { inner: 0.7, outer: 1.15, color: "#c9a97a" } },
  { name: "Uranus",  color: "#9fdfe8", size: 0.40, distance: 8.7, speed: 0.10 },
  { name: "Neptune", color: "#4868c8", size: 0.40, distance: 9.8, speed: 0.08 },
];

function Orbit({ radius }: { radius: number }) {
  const geom = useMemo(() => {
    const segments = 128;
    const pos = new Float32Array((segments + 1) * 3);
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * radius;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = Math.sin(a) * radius;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [radius]);
  return (
    <line>
      <primitive object={geom} attach="geometry" />
      <lineBasicMaterial color="#5b6cff" transparent opacity={0.18} />
    </line>
  );
}

function Planet({ cfg, t }: { cfg: PlanetCfg; t: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    t.current += delta;
    if (group.current) {
      const a = t.current * cfg.speed;
      group.current.position.set(Math.cos(a) * cfg.distance, 0, Math.sin(a) * cfg.distance);
    }
    if (mesh.current) mesh.current.rotation.y += delta * 0.6;
  });
  return (
    <group ref={group}>
      <mesh ref={mesh} castShadow>
        <sphereGeometry args={[cfg.size, 48, 48]} />
        <meshStandardMaterial
          color={cfg.color}
          roughness={0.65}
          metalness={0.15}
          emissive={cfg.color}
          emissiveIntensity={0.12}
        />
      </mesh>
      {cfg.ring && (
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <ringGeometry args={[cfg.size * cfg.ring.inner + cfg.size, cfg.size * cfg.ring.outer + cfg.size, 64]} />
          <meshBasicMaterial color={cfg.ring.color} side={THREE.DoubleSide} transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
}

function Sun() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.1; });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[1.05, 64, 64]} />
        <meshBasicMaterial color="#ffd27a" />
      </mesh>
      {/* glow */}
      <mesh>
        <sphereGeometry args={[1.35, 32, 32]} />
        <meshBasicMaterial color="#ff9a3c" transparent opacity={0.18} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color="#ff6a1a" transparent opacity={0.07} />
      </mesh>
      <pointLight color="#ffd27a" intensity={3} distance={50} decay={1.4} />
    </group>
  );
}

export function SolarSystem() {
  const t = useRef(0);
  return (
    <group rotation={[0.35, 0, 0]}>
      <Sun />
      {PLANETS.map((p) => (
        <group key={p.name}>
          <Orbit radius={p.distance} />
          <Planet cfg={p} t={t} />
        </group>
      ))}
    </group>
  );
}
