import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function BlackHole() {
  const disk = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  const diskTexture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 512;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createRadialGradient(256, 256, 80, 256, 256, 256);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(0.35, "rgba(255,180,80,0.95)");
    grad.addColorStop(0.55, "rgba(255,90,40,0.8)");
    grad.addColorStop(0.85, "rgba(120,40,180,0.5)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    // streaks
    for (let i = 0; i < 220; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 110 + Math.random() * 130;
      ctx.fillStyle = `rgba(255,${200 + Math.random()*55},${150 + Math.random()*80},${Math.random()*0.5})`;
      ctx.beginPath();
      ctx.arc(256 + Math.cos(a) * r, 256 + Math.sin(a) * r, Math.random() * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame((_, d) => {
    if (disk.current) disk.current.rotation.z += d * 0.4;
    if (halo.current) halo.current.rotation.z -= d * 0.2;
  });

  return (
    <group rotation={[Math.PI / 2.6, 0, 0]}>
      {/* event horizon */}
      <mesh>
        <sphereGeometry args={[0.9, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* photon ring */}
      <mesh ref={halo}>
        <ringGeometry args={[0.95, 1.05, 128]} />
        <meshBasicMaterial color="#ffd27a" side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
      {/* accretion disk */}
      <mesh ref={disk}>
        <ringGeometry args={[1.1, 3.4, 128]} />
        <meshBasicMaterial map={diskTexture} side={THREE.DoubleSide} transparent />
      </mesh>
    </group>
  );
}
