import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClientCanvas } from "@/components/three/ClientCanvas";
import { StarField } from "@/components/three/StarField";
import { PlanetScene } from "@/components/three/PlanetScene";
import { MousePointerClick, ArrowLeftRight } from "lucide-react";
import { PLANETS } from "@/data/planets";
import { useProfile } from "@/lib/profile";

export const Route = createFileRoute("/planets")({
  head: () => ({
    meta: [
      { title: "The Planets — Cosmoverse" },
      { name: "description", content: "Tour all 8 planets of the Solar System in 3D. Click the glowing pins on each planet for kid-friendly facts and quick quizzes." },
      { property: "og:title", content: "The Planets — Cosmoverse" },
      { property: "og:description", content: "Interactive 3D tour with clickable walk-throughs and quizzes for every planet." },
    ],
  }),
  component: Planets,
});

function Planets() {
  const [active, setActive] = useState(2);
  const p = PLANETS[active];
  const { visitPlanet } = useProfile();
  useEffect(() => { visitPlanet(p.key); }, [p.key, visitPlanet]);

  return (
    <div className="relative pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <header className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Chapter 01</p>
          <h1 className="mt-3 text-5xl md:text-6xl font-bold">The Planets</h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Eight worlds dance around our Sun. Pick one to spin it, then tap the glowing pins to discover its secrets — and try the quick quiz.
          </p>
          <Link
            to="/compare"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary/15 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/25"
          >
            <ArrowLeftRight className="h-4 w-4" /> Compare two planets
          </Link>
        </header>

        <div className="mt-12 grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-square w-full glass rounded-3xl overflow-hidden">
            <ClientCanvas camera={{ position: [0, 1.2, 5], fov: 45 }} dpr={[1, 1.8]}>
              <color attach="background" args={["#08061a"]} />
              <ambientLight intensity={0.4} />
              <directionalLight position={[4, 3, 5]} intensity={1.4} />
              <StarField count={1500} radius={40} speed={0.005} />
              <PlanetScene
                planetKey={p.key}
                color={p.color}
                emissive={p.emissive}
                ring={p.ring}
                ringColor={p.ringColor}
                hotspots={p.hotspots}
              />
            </ClientCanvas>
            <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <MousePointerClick className="h-3 w-3 text-accent" /> Tap a glowing pin
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{active + 1} / {PLANETS.length}</div>
            <h2 className="mt-2 text-5xl font-bold text-aurora">{p.name}</h2>
            <p className="mt-3 text-lg text-muted-foreground">{p.tagline}</p>

            <dl className="mt-8 grid grid-cols-2 gap-4">
              {[
                ["Diameter", p.diameter],
                ["Day length", p.day],
                ["Year length", p.year],
                ["Moons", p.moons],
              ].map(([k, v]) => (
                <div key={k} className="glass rounded-2xl p-4">
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
                  <dd className="mt-1 text-lg font-semibold">{v}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-6 space-y-2">
              {p.facts.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 glass rounded-2xl p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-primary">Walk-through pins</div>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {p.hotspots.map((h) => (
                  <li key={h.id} className="flex gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />{h.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-4 md:grid-cols-8 gap-3">
          {PLANETS.map((pl, i) => (
            <button
              key={pl.name}
              onClick={() => setActive(i)}
              className={`group flex flex-col items-center gap-2 rounded-2xl p-3 transition ${
                i === active ? "glass shadow-glow" : "hover:bg-white/5"
              }`}
            >
              <span
                className="h-10 w-10 rounded-full"
                style={{ background: `radial-gradient(circle at 30% 30%, white 0%, ${pl.color} 35%, oklch(0.08 0.03 270) 100%)` }}
              />
              <span className="text-xs font-medium">{pl.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-5">
          {[
            { t: "The Sun", d: "A 4.6-billion-year-old G-type star whose gravity holds the entire Solar System together. It converts 4 million tonnes of matter into energy every second." },
            { t: "Moons", d: "Over 290 moons orbit the planets. Jupiter's Ganymede is the largest — bigger than Mercury itself." },
            { t: "Asteroids & Comets", d: "Rocky leftovers from the Solar System's birth. The asteroid belt sits between Mars and Jupiter; comets travel from the icy Kuiper Belt and Oort Cloud." },
          ].map((c) => (
            <div key={c.t} className="glass rounded-2xl p-6">
              <div className="text-sm uppercase tracking-wider text-primary">{c.t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
