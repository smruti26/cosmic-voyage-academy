import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  /** 0..1 — scroll-driven intensification */
  intensity?: number;
}

/* ------------------------------------------------------------------ */
/* Lensing backdrop: a large plane behind the hole that warps a       */
/* procedural starfield around the singularity to simulate gravity.   */
/* ------------------------------------------------------------------ */
const lensingVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const lensingFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;

  // hash & noise utilities for a procedural starfield
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float stars(vec2 uv, float density, float brightness) {
    vec2 g = floor(uv * density);
    vec2 f = fract(uv * density);
    float h = hash(g);
    float r = step(0.985, h);
    float d = length(f - 0.5);
    float twinkle = 0.6 + 0.4 * sin(uTime * 2.0 + h * 30.0);
    return r * smoothstep(0.5, 0.0, d) * brightness * twinkle;
  }

  vec3 nebula(vec2 uv) {
    float n = sin(uv.x * 3.0 + uTime * 0.1) * cos(uv.y * 4.0 - uTime * 0.07);
    vec3 a = vec3(0.55, 0.20, 0.65);  // magenta
    vec3 b = vec3(0.10, 0.20, 0.55);  // deep blue
    return mix(a, b, 0.5 + 0.5 * n) * 0.18;
  }

  void main() {
    vec2 uv = vUv - 0.5;
    float r = length(uv);

    // Gravitational lensing: bend coordinates around the center.
    // Bend strength grows with intensity.
    float bend = (0.04 + 0.10 * uIntensity) / max(r * r, 0.005);
    vec2 dir = normalize(uv);
    vec2 warped = (uv - dir * bend) + 0.5;

    // Stars sampled in warped space.
    vec3 col = vec3(0.0);
    col += stars(warped * 1.4, 80.0, 1.2);
    col += stars(warped * 2.1 + 2.3, 140.0, 0.7);
    col += stars(warped * 0.7 + 5.1, 40.0, 0.9);
    col += nebula(warped);

    // Photon ring brightening near the hole
    float ring = smoothstep(0.18, 0.165, r) - smoothstep(0.165, 0.14, r);
    col += ring * vec3(1.0, 0.78, 0.35) * (1.5 + uIntensity * 2.0);

    // Pitch-black event horizon disk
    float horizon = smoothstep(0.135, 0.125, r);
    col *= (1.0 - horizon);

    // Subtle vignette
    col *= 1.0 - smoothstep(0.45, 0.7, r) * 0.6;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function LensingBackdrop({ intensity }: { intensity: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uIntensity: { value: intensity } }),
    [],
  );
  useFrame((s, d) => {
    if (matRef.current) {
      (matRef.current.uniforms.uTime as { value: number }).value += d;
      (matRef.current.uniforms.uIntensity as { value: number }).value = THREE.MathUtils.lerp(
        (matRef.current.uniforms.uIntensity as { value: number }).value,
        intensity,
        Math.min(1, d * 3),
      );
    }
  });
  return (
    <mesh position={[0, 0, -3]}>
      <planeGeometry args={[24, 14]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={lensingVertex}
        fragmentShader={lensingFragment}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Swirling accretion disk built with a custom shader: spiral lanes,  */
/* doppler brightening on the leading edge, hot inner ring.           */
/* ------------------------------------------------------------------ */
const diskVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const diskFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;       // 0 at center, 1 at outer ring
    if (r > 1.0 || r < 0.30) discard;

    float ang = atan(p.y, p.x);
    float spin = uTime * (0.6 + uIntensity * 1.4);

    // spiral coordinate
    float spiral = ang + spin + log(r + 0.01) * 5.5;
    float lanes = 0.55 + 0.45 * sin(spiral * 4.0);

    // turbulent noise
    float n = noise(vec2(spiral * 2.0, r * 7.0 + uTime * 0.5));
    float density = lanes * (0.5 + 0.5 * n);

    // doppler-like brightening on the approaching side (left half)
    float doppler = smoothstep(0.0, -1.0, p.x / max(r, 0.01)) * 0.9 + 0.4;

    // radial color: white-hot inner, orange middle, magenta outer
    vec3 hot   = vec3(1.0, 0.95, 0.75);
    vec3 amber = vec3(1.0, 0.55, 0.18);
    vec3 plasma= vec3(0.65, 0.20, 0.55);
    vec3 col = mix(hot, amber, smoothstep(0.30, 0.55, r));
    col = mix(col, plasma, smoothstep(0.55, 1.0, r));

    col *= density * doppler * (1.4 + uIntensity * 1.6);

    // soft edges
    float edge = smoothstep(1.0, 0.85, r) * smoothstep(0.30, 0.42, r);
    float alpha = edge * (0.45 + 0.55 * density);

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;

function AccretionDisk({ intensity }: { intensity: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uIntensity: { value: intensity } }),
    [],
  );
  useFrame((_, d) => {
    if (matRef.current) {
      (matRef.current.uniforms.uTime as { value: number }).value += d;
      (matRef.current.uniforms.uIntensity as { value: number }).value = THREE.MathUtils.lerp(
        (matRef.current.uniforms.uIntensity as { value: number }).value,
        intensity,
        Math.min(1, d * 3),
      );
    }
  });
  return (
    <mesh rotation={[Math.PI / 2.4, 0, 0]}>
      <ringGeometry args={[0.95, 3.6, 256]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={diskVertex}
        fragmentShader={diskFragment}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
export function BlackHole({ intensity = 0 }: Props) {
  const haloRef = useRef<THREE.Mesh>(null);
  const I = Math.max(0, Math.min(1, intensity));

  useFrame((s) => {
    if (haloRef.current) {
      const t = s.clock.elapsedTime;
      const pulse = 1.0 + Math.sin(t * 1.5) * 0.04 + I * 0.25;
      haloRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <LensingBackdrop intensity={I} />

      {/* event horizon */}
      <mesh>
        <sphereGeometry args={[0.9, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* photon ring halo */}
      <mesh ref={haloRef} rotation={[Math.PI / 2.4, 0, 0]}>
        <ringGeometry args={[0.92, 1.02, 128]} />
        <meshBasicMaterial color="#ffd27a" side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>

      <AccretionDisk intensity={I} />

      {/* outer ambient glow */}
      <mesh>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial color="#ff7a3c" transparent opacity={0.03 + I * 0.05} />
      </mesh>
    </group>
  );
}
