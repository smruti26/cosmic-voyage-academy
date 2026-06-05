import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  color: string;
  ring?: boolean;
  ringColor?: string;
  emissive?: string;
}

export function PlanetScene({ color, ring, ringColor = "#d6b272", emissive }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, d) => { if (mesh.current) mesh.current.rotation.y += d * 0.25; });
  return (
    <group>
      <mesh ref={mesh}>
        <sphereGeometry args={[1.4, 96, 96]} />
        <meshStandardMaterial
          color={color}
          roughness={0.6}
          metalness={0.2}
          emissive={emissive ?? color}
          emissiveIntensity={emissive ? 0.4 : 0.15}
        />
      </mesh>
      {ring && (
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <ringGeometry args={[2.0, 2.8, 96]} />
          <meshBasicMaterial color={ringColor} side={THREE.DoubleSide} transparent opacity={0.55} />
        </mesh>
      )}
      {/* atmosphere */}
      <mesh>
        <sphereGeometry args={[1.55, 48, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>
    </group>
  );
}
