import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type CraftType = "rocket" | "orbiter" | "lander" | "satellite" | "probe";

interface Props {
  type: CraftType;
  accent?: string;
}

function FlamePlume() {
  return (
    <>
      <mesh position={[0, -1.2, 0]}>
        <coneGeometry args={[0.3, 0.7, 24]} />
        <meshBasicMaterial color="#ffd27a" transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, -1.45, 0]}>
        <coneGeometry args={[0.18, 0.5, 24]} />
        <meshBasicMaterial color="#ff5a1a" transparent opacity={0.7} />
      </mesh>
      <pointLight position={[0, -1.3, 0]} intensity={3} color="#ffb15c" distance={5} />
    </>
  );
}

function SolarPanels({ accent = "#3a8dff" }: { accent?: string }) {
  return (
    <>
      {[1, -1].map((s) => (
        <group key={s} position={[s * 0.9, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.1, 0.6, 0.03]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.35} metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[-s * 0.6, 0, 0.02]}>
            <boxGeometry args={[0.05, 0.6, 0.05]} />
            <meshStandardMaterial color="#bcd0e8" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </>
  );
}

export function Spacecraft3D({ type, accent = "#ff7a3c" }: Props) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * 0.35;
    ref.current.position.y = Math.sin(s.clock.elapsedTime * 0.8) * 0.12;
  });

  return (
    <group ref={ref}>
      {type === "rocket" && (
        <>
          <mesh>
            <cylinderGeometry args={[0.35, 0.35, 1.8, 32]} />
            <meshStandardMaterial color="#e8ecf3" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.25, 0]}>
            <coneGeometry args={[0.35, 0.7, 32]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.25} />
          </mesh>
          {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((r, i) => (
            <mesh key={i} position={[0, -0.85, 0]} rotation={[0, r, 0]}>
              <boxGeometry args={[0.6, 0.35, 0.05]} />
              <meshStandardMaterial color={accent} />
            </mesh>
          ))}
          <FlamePlume />
        </>
      )}

      {type === "orbiter" && (
        <>
          {/* main bus */}
          <mesh>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshStandardMaterial color="#f6d27a" metalness={0.6} roughness={0.4} emissive="#bf8f2f" emissiveIntensity={0.2} />
          </mesh>
          {/* dish antenna */}
          <mesh position={[0, 0.55, 0.4]} rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.06, 32, 1, true]} />
            <meshStandardMaterial color="#e8ecf3" metalness={0.5} roughness={0.4} side={THREE.DoubleSide} />
          </mesh>
          <SolarPanels accent={accent} />
        </>
      )}

      {type === "lander" && (
        <>
          {/* body */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.55, 0.7, 0.55, 6]} />
            <meshStandardMaterial color="#d9c47e" metalness={0.5} roughness={0.45} emissive="#7a5d20" emissiveIntensity={0.15} />
          </mesh>
          {/* top sensor */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.25, 16]} />
            <meshStandardMaterial color="#e8ecf3" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* legs */}
          {[0, 1, 2, 3].map((i) => {
            const a = (i / 4) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.6, -0.4, Math.sin(a) * 0.6]} rotation={[0, -a, Math.PI / 7]}>
                <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
                <meshStandardMaterial color="#9aa3b2" metalness={0.7} roughness={0.3} />
              </mesh>
            );
          })}
          {/* foot pads */}
          {[0, 1, 2, 3].map((i) => {
            const a = (i / 4) * Math.PI * 2;
            return (
              <mesh key={`p${i}`} position={[Math.cos(a) * 0.85, -0.78, Math.sin(a) * 0.85]}>
                <cylinderGeometry args={[0.13, 0.13, 0.05, 16]} />
                <meshStandardMaterial color={accent} />
              </mesh>
            );
          })}
        </>
      )}

      {type === "satellite" && (
        <>
          <mesh>
            <boxGeometry args={[0.55, 0.9, 0.55]} />
            <meshStandardMaterial color="#cfd6e2" metalness={0.55} roughness={0.4} />
          </mesh>
          {/* small dish */}
          <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 8, 0, 0]}>
            <coneGeometry args={[0.18, 0.1, 24, 1, true]} />
            <meshStandardMaterial color="#fff" metalness={0.5} roughness={0.3} side={THREE.DoubleSide} />
          </mesh>
          <SolarPanels accent={accent} />
        </>
      )}

      {type === "probe" && (
        <>
          {/* heat shield */}
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.7, 0.4, 32]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.35} metalness={0.4} roughness={0.5} />
          </mesh>
          {/* instrument body */}
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.5, 24]} />
            <meshStandardMaterial color="#e8ecf3" metalness={0.6} roughness={0.4} />
          </mesh>
          <SolarPanels accent="#5cd0ff" />
        </>
      )}
    </group>
  );
}
