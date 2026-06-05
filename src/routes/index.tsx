import { createFileRoute, Link } from "@tanstack/react-router";
import { ClientCanvas } from "@/components/three/ClientCanvas";
import { StarField } from "@/components/three/StarField";
import { SolarSystem } from "@/components/three/SolarSystem";
import { ArrowRight, Sparkles, Telescope, Globe2, Orbit, Rocket } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cosmoverse — A Cinematic 3D Tour of the Universe" },
      { name: "description", content: "Blast off through a real-time 3D solar system, fly past galaxies and black holes, and discover ISRO's missions — designed for curious kids." },
      { property: "og:title", content: "Cosmoverse — Explore the Universe in 3D" },
      { property: "og:description", content: "An immersive cinematic space adventure for young explorers." },
    ],
  }),
  component: Index,
});

const TOPICS = [
  { to: "/planets", title: "The Planets", desc: "Tour all 8 worlds of our Solar System — from scorching Mercury to icy Neptune.", icon: Globe2 },
  { to: "/galaxy", title: "Milky Way Galaxy", desc: "Soar through 200 billion stars in our spiral home and meet our cosmic neighbors.", icon: Orbit },
  { to: "/black-holes", title: "Black Holes", desc: "Peek past the event horizon and learn how stars collapse into the universe's strangest objects.", icon: Sparkles },
  { to: "/stars", title: "Stars & Nebulae", desc: "How stars are born, how they die, and the glowing clouds where new suns ignite.", icon: Telescope },
  { to: "/isro", title: "ISRO Missions", desc: "India's journey to the Moon, Mars, and the Sun — Chandrayaan, Mangalyaan and Aditya.", icon: Rocket },
] as const;

const STATS = [
  { v: "100B+", l: "Galaxies in the universe" },
  { v: "8", l: "Planets in our Solar System" },
  { v: "13.8B", l: "Years since the Big Bang" },
  { v: "1.4M km", l: "Diameter of the Sun" },
];

function Index() {
  return (
    <div className="relative">
      {/* HERO with 3D solar system */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <ClientCanvas
            camera={{ position: [0, 4.5, 14], fov: 55 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.8]}
          >
            <color attach="background" args={["#05030f"]} />
            <fog attach="fog" args={["#05030f", 20, 55]} />
            <ambientLight intensity={0.15} />
            <StarField count={3500} radius={70} />
            <SolarSystem />
          </ClientCanvas>
        </div>
        {/* vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.05_0.02_270/0.85)_100%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 h-full flex flex-col justify-center pt-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Cinematic 3D · Built for curious minds
            </span>
            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05]">
              Explore the <span className="text-aurora glow-text">Universe</span><br />
              in real time.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Climb aboard Cosmoverse and journey through the Solar System, the Milky Way, black holes and India's most ambitious space missions — rendered in immersive 3D, designed for young explorers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/planets" className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.03]">
                Begin the journey
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link to="/galaxy" className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-white/10">
                Visit the Milky Way
              </Link>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground animate-float-slow">
          Scroll to explore
          <span className="h-10 w-px bg-gradient-to-b from-foreground/60 to-transparent" />
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.l} className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-aurora">{s.v}</div>
              <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TOPICS */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Five universes to explore</p>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold">Pick your destination.</h2>
            <p className="mt-4 text-muted-foreground">
              Each chapter is a fully interactive 3D scene with bite-sized lessons, fun facts and dazzling visuals.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map(({ to, title, desc, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="group relative overflow-hidden rounded-3xl glass p-6 transition hover:-translate-y-1 hover:shadow-nebula"
              >
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-nebula opacity-20 blur-3xl transition group-hover:opacity-40" />
                <Icon className="h-8 w-8 text-primary" />
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Launch <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION QUOTE */}
      <section className="relative py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-accent" />
          <blockquote className="mt-6 text-3xl md:text-4xl font-semibold leading-tight">
            "Somewhere, something incredible is waiting to be <span className="text-aurora">known</span>."
          </blockquote>
          <div className="mt-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">— Carl Sagan</div>
        </div>
      </section>
    </div>
  );
}
