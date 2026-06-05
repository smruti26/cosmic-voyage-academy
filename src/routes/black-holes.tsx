import { createFileRoute } from "@tanstack/react-router";
import { ClientCanvas } from "@/components/three/ClientCanvas";
import { StarField } from "@/components/three/StarField";
import { BlackHole } from "@/components/three/BlackHole";

export const Route = createFileRoute("/black-holes")({
  head: () => ({
    meta: [
      { title: "Black Holes — Cosmoverse" },
      { name: "description", content: "Learn how black holes form, what an event horizon is, and meet Sagittarius A* — the supermassive monster at our galaxy's heart." },
      { property: "og:title", content: "Black Holes — Cosmoverse" },
      { property: "og:description", content: "A cinematic 3D look at the universe's strangest objects." },
    ],
  }),
  component: BlackHoles,
});

const STAGES = [
  { t: "1. A massive star runs out of fuel", d: "After billions of years, a star at least 20× the Sun's mass exhausts its hydrogen and helium." },
  { t: "2. Supernova collapse", d: "Its core implodes faster than the speed of sound and the outer layers explode as a supernova." },
  { t: "3. Singularity forms", d: "If the leftover core is more than ~3 solar masses, nothing can stop gravity — it crushes itself into a single point." },
  { t: "4. Event horizon", d: "A sphere around the singularity where escape velocity exceeds light speed. Cross it and you can never come back." },
];

function BlackHoles() {
  return (
    <div className="relative pt-32 pb-20">
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <ClientCanvas camera={{ position: [0, 2, 6.5], fov: 50 }} dpr={[1, 1.8]}>
            <color attach="background" args={["#02010a"]} />
            <ambientLight intensity={0.2} />
            <StarField count={3000} radius={60} />
            <BlackHole />
          </ClientCanvas>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0.02_0.01_270/0.9)_85%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 h-full flex flex-col justify-end pb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Chapter 03</p>
          <h1 className="mt-3 text-5xl md:text-7xl font-bold max-w-3xl">Into the <span className="text-aurora glow-text">Black Hole</span></h1>
          <p className="mt-4 max-w-2xl text-muted-foreground text-lg">
            Where gravity is so powerful that not even light can escape. The strangest, densest objects in the universe.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 mt-20">
        <h2 className="text-3xl md:text-4xl font-bold">How a black hole is born</h2>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STAGES.map((s) => (
            <div key={s.t} className="glass rounded-2xl p-6">
              <div className="text-sm font-semibold text-primary">{s.t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 mt-20 grid lg:grid-cols-3 gap-5">
        {[
          { k: "Stellar", v: "5–100 ☉", d: "Born from a single collapsing star." },
          { k: "Intermediate", v: "100–100,000 ☉", d: "The rarest class — possibly formed from merging stellar holes." },
          { k: "Supermassive", v: "Millions–Billions ☉", d: "Sit at the heart of nearly every galaxy. Ours is Sagittarius A* with 4.3 million solar masses." },
        ].map((c) => (
          <div key={c.k} className="glass rounded-2xl p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.k}</div>
            <div className="mt-1 text-3xl font-bold text-aurora">{c.v}</div>
            <p className="mt-3 text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
