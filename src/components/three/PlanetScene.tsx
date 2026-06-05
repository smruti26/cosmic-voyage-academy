import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export interface Hotspot {
  id: string;
  lat: number;   // degrees, -90..90
  lon: number;   // degrees, -180..180
  title: string;
  fact: string;
}

interface Props {
  planetKey: string; // resets popup when planet changes
  color: string;
  ring?: boolean;
  ringColor?: string;
  emissive?: string;
  hotspots?: Hotspot[];
}

const R = 1.4;

function latLonToXYZ(lat: number, lon: number, r = R) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return [
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  ] as const;
}

export function PlanetScene({ planetKey, color, ring, ringColor = "#d6b272", emissive, hotspots = [] }: Props) {
  const group = useRef<THREE.Group>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // reset selected hotspot when planet changes
  useEffect(() => { setActiveId(null); }, [planetKey]);

  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.18; });

  const active = hotspots.find((h) => h.id === activeId) ?? null;

  return (
    <group>
      {/* atmosphere — outside rotation so it doesn't spin */}
      <mesh>
        <sphereGeometry args={[R * 1.11, 48, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>

      {/* rotating globe + hotspots */}
      <group ref={group}>
        <mesh>
          <sphereGeometry args={[R, 96, 96]} />
          <meshStandardMaterial
            color={color}
            roughness={0.6}
            metalness={0.2}
            emissive={emissive ?? color}
            emissiveIntensity={emissive ? 0.4 : 0.15}
          />
        </mesh>

        {hotspots.map((h) => {
          const [x, y, z] = latLonToXYZ(h.lat, h.lon, R * 1.01);
          const isActive = activeId === h.id;
          return (
            <group key={h.id} position={[x, y, z]}>
              <mesh
                onClick={(e) => { e.stopPropagation(); setActiveId(isActive ? null : h.id); }}
                onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
                onPointerOut={() => { document.body.style.cursor = ""; }}
              >
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshBasicMaterial color={isActive ? "#ffd27a" : "#5cd0ff"} />
              </mesh>
              {/* pulsing halo */}
              <mesh>
                <sphereGeometry args={[0.11, 16, 16]} />
                <meshBasicMaterial color={isActive ? "#ffd27a" : "#5cd0ff"} transparent opacity={0.25} />
              </mesh>
            </group>
          );
        })}
      </group>

      {ring && (
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <ringGeometry args={[2.0, 2.8, 96]} />
          <meshBasicMaterial color={ringColor} side={THREE.DoubleSide} transparent opacity={0.55} />
        </mesh>
      )}

      {/* Popup card via drei Html (fixed in world, not rotated) */}
      {active && (() => {
        const [x, y, z] = latLonToXYZ(active.lat, active.lon, R * 1.6);
        return (
          <Html
            position={[x, y, z]}
            center
            distanceFactor={6}
            zIndexRange={[20, 0]}
            style={{ pointerEvents: "auto" }}
          >
            <div className="glass rounded-xl p-3 w-56 shadow-nebula animate-fade-in">
              <div className="text-[10px] uppercase tracking-[0.25em] text-accent">Discover</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{active.title}</div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{active.fact}</p>
              <button
                onClick={() => setActiveId(null)}
                className="mt-2 text-[11px] text-primary hover:underline"
              >
                Close
              </button>
            </div>
          </Html>
        );
      })()}
    </group>
  );
}
