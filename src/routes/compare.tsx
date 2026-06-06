import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PLANETS } from "@/data/planets";
import { ClientCanvas } from "@/components/three/ClientCanvas";
import { StarField } from "@/components/three/StarField";
import { PlanetScene } from "@/components/three/PlanetScene";
import { compareInsights } from "@/lib/ai-brain";
import { ArrowLeft, Sparkles } from "lucide-react";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Planets — Cosmoverse" },
      { name: "description", content: "Pick any two planets and see them side-by-side: size, distance from the Sun, moons, gravity and AI-generated fun insights." },
      { property: "og:title", content: "Compare Planets — Cosmoverse" },
      { property: "og:description", content: "Side-by-side planet comparison with AI insights for kids." },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const [aKey, setAKey] = useState("earth");
  const [bKey, setBKey] = useState("jupiter");
  const a = PLANETS.find((p) => p.key === aKey)!;
  const b = PLANETS.find((p) => p.key === bKey)!;
  const insights = compareInsights(a, b);

  const ROWS: { label: string; getA: () => string; getB: () => string }[] = [
    { label: "Diameter", getA: () => a.diameter, getB: () => b.diameter },
    { label: "Distance from Sun", getA: () => `${a.distanceAU.toFixed(2)} AU`, getB: () => `${b.distanceAU.toFixed(2)} AU` },
    { label: "Day length", getA: () => a.day, getB: () => b.day },
    { label: "Year length", getA: () => a.year, getB: () => b.year },
    { label: "Moons", getA: () => a.moons, getB: () => b.moons },
    { label: "Gravity", getA: () => a.gravity, getB: () => b.gravity },
    { label: "Surface temp (°C)", getA: () => a.surfaceTempC, getB: () => b.surfaceTempC },
    { label: "Fun fact", getA: () => a.funFact, getB: () => b.funFact },
  ];

  const maxD = Math.max(a.diameterKm, b.diameterKm);

  return (
    <div className="relative pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <Link to="/planets" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to planets
        </Link>
        <header className="mt-4 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Compare Mode</p>
          <h1 className="mt-3 text-5xl md:text-6xl font-bold">Two worlds, side-by-side</h1>
          <p className="mt-4 text-muted-foreground text-lg">Pick any two planets to see how they stack up. Our AI brain will whip up cool insights you won't find in a textbook.</p>
        </header>

        {/* picker */}
        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {[{ side: "A", key: aKey, setKey: setAKey }, { side: "B", key: bKey, setKey: setBKey }].map(({ side, key, setKey }) => (
            <div key={side} className="glass rounded-2xl p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Planet {side}</div>
              <div className="flex flex-wrap gap-2">
                {PLANETS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setKey(p.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition
                      ${key === p.key ? "border-primary bg-primary/20 text-foreground" : "border-white/10 text-muted-foreground hover:bg-white/5"}`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 3D side-by-side */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {[a, b].map((pl, i) => (
            <div key={i} className="relative aspect-square w-full glass rounded-3xl overflow-hidden">
              <ClientCanvas camera={{ position: [0, 1, 5], fov: 45 }} dpr={[1, 1.6]}>
                <color attach="background" args={["#08061a"]} />
                <ambientLight intensity={0.4} />
                <directionalLight position={[4, 3, 5]} intensity={1.3} />
                <StarField count={900} radius={40} />
                <PlanetScene planetKey={pl.key} color={pl.color} emissive={pl.emissive} ring={pl.ring} ringColor={pl.ringColor} hotspots={[]} />
              </ClientCanvas>
              <div className="absolute top-3 left-3 glass rounded-full px-3 py-1 text-xs font-semibold">{pl.name}</div>
            </div>
          ))}
        </div>

        {/* size-scale visual */}
        <div className="mt-8 glass rounded-3xl p-6">
          <div className="text-xs uppercase tracking-[0.25em] text-accent">Size, to scale</div>
          <div className="mt-4 flex items-end justify-center gap-10 h-48">
            {[a, b].map((pl) => {
              const scale = (pl.diameterKm / maxD) * 100;
              return (
                <div key={pl.key} className="flex flex-col items-center">
                  <div
                    className="rounded-full shadow-glow"
                    style={{
                      width: `${scale * 1.5}px`,
                      height: `${scale * 1.5}px`,
                      background: `radial-gradient(circle at 30% 30%, white 0%, ${pl.color} 40%, oklch(0.08 0.03 270) 100%)`,
                    }}
                  />
                  <div className="mt-3 text-sm font-semibold">{pl.name}</div>
                  <div className="text-[11px] text-muted-foreground">{pl.diameter}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* table */}
        <div className="mt-8 glass rounded-3xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-white/10">
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground">Property</th>
                <th className="py-3 px-4 text-base font-semibold text-aurora">{a.name}</th>
                <th className="py-3 px-4 text-base font-semibold text-aurora">{b.name}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-white/5 last:border-0">
                  <td className="py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground">{r.label}</td>
                  <td className="py-3 px-4">{r.getA()}</td>
                  <td className="py-3 px-4">{r.getB()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI insights */}
        <div className="mt-8 glass rounded-3xl p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent">
            <Sparkles className="h-3.5 w-3.5" /> AI insights
          </div>
          <ul className="mt-3 space-y-2">
            {insights.map((line, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
