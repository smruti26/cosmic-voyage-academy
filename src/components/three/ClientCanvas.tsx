import { useEffect, useState, type ReactNode } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";

interface Props extends Omit<CanvasProps, "children"> {
  children: ReactNode;
  fallback?: ReactNode;
}

// Renders R3F Canvas only on the client to avoid SSR / WebGL issues.
export function ClientCanvas({ children, fallback, ...props }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{fallback ?? null}</>;
  return <Canvas {...props}>{children}</Canvas>;
}
