import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props { count?: number; arms?: number; radius?: number; }

export function SpiralGalaxy({ count = 12000, arms = 4, radius = 6 }: Props) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const inside = new THREE.Color("#ffd27a");
    const outside = new THREE.Color("#5b8dff");
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.6) * radius;
      const branch = (i % arms) / arms * Math.PI * 2;
      const spin = r * 0.9;
      const rand = (Math.random() ** 2) * (Math.random() < 0.5 ? 1 : -1) * 0.35;
      const x = Math.cos(branch + spin) * r + rand * r;
      const z = Math.sin(branch + spin) * r + rand * r;
      const y = rand * 0.6;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      const mix = inside.clone().lerp(outside, r / radius);
      colors[i * 3] = mix.r;
      colors[i * 3 + 1] = mix.g;
      colors[i * 3 + 2] = mix.b;
    }
    return { positions, colors };
  }, [count, arms, radius]);

  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.05; });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} sizeAttenuation vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}
