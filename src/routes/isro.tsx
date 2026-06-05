import { createFileRoute, Link } from "@tanstack/react-router";
import { ClientCanvas } from "@/components/three/ClientCanvas";
import { StarField } from "@/components/three/StarField";
import { Spacecraft3D } from "@/components/three/Spacecraft3D";
import { MISSIONS } from "@/data/missions";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/isro")({
  head: () => ({
    meta: [
      { title: "ISRO Missions — Cosmoverse" },
      { name: "description", content: "From Aryabhata to Chandrayaan-3 and Aditya-L1 — explore India's most ambitious space missions in interactive 3D mission pages with timelines and kid-friendly checklists." },
      { property: "og:title", content: "ISRO Missions — Cosmoverse" },
      { property: "og:description", content: "India's journey to the Moon, Mars and the Sun, told in 3D." },
    ],
  }),
  component: ISRO,
});

// Heritage timeline events with no dedicated detail page yet.
const HERITAGE = [
  { year: "1969", name: "ISRO is founded", d: "Dr. Vikram Sarabhai sets up the Indian Space Research Organisation." },
  { year: "1975", name: "Aryabhata", d: "India's first satellite — named after the 5th-century mathematician." },
  { year: "1980", name: "Rohini RS-1", d: "First satellite launched by an Indian-built rocket (SLV-3)." },
  { year: "2017", name: "PSLV-C37 world record", d: "Launched 104 satellites in a single mission." },
  { year: "2019", name: "Chandrayaan-2", d: "Orbiter still studies the Moon today; the lander attempt taught crucial lessons for the next mission." },
];

function ISRO() {
  return (
    <div className="relative pt-32 pb-20">
      <section className="relative mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Chapter 05</p>
            <h1 className="mt-3 text-5xl md:text-6xl font-bold">
              <span className="text-aurora">ISRO</span><br />India in space
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              The Indian Space Research Organisation began in 1969 with a vision to use space for national development. Today it sends rockets to the Moon, Mars and the Sun — at a fraction of the cost of other space programmes.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                ["1969", "ISRO founded"],
                ["432+", "Satellites launched"],
                ["3", "Worlds reached"],
              ].map(([k, v]) => (
                <div key={k} className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-aurora">{k}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-square w-full glass rounded-3xl overflow-hidden">
            <ClientCanvas camera={{ position: [3.5, 1.2, 4.5], fov: 45 }} dpr={[1, 1.8]}>
              <color attach="background" args={["#06041a"]} />
              <ambientLight intensity={0.35} />
              <directionalLight position={[5, 5, 5]} intensity={1.2} />
              <StarField count={1200} radius={40} />
              <Spacecraft3D type="rocket" accent="#ff7a3c" />
            </ClientCanvas>
          </div>
        </div>
      </section>

      {/* Featured missions with detail pages */}
      <section className="mx-auto max-w-7xl px-6 mt-24">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Featured missions</h2>
            <p className="mt-2 text-muted-foreground">Click in for the 3D spacecraft, full timeline and astronaut checklist.</p>
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{MISSIONS.length} missions</span>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {MISSIONS.map((m) => (
            <Link
              key={m.slug}
              to="/isro/$mission"
              params={{ mission: m.slug }}
              className="group relative overflow-hidden rounded-3xl glass p-6 transition hover:-translate-y-1 hover:shadow-nebula"
            >
              <div
                className="absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-30 blur-3xl transition group-hover:opacity-60"
                style={{ background: m.accent }}
              />
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span className="text-primary font-mono">{m.year}</span> · {m.category}
              </div>
              <h3 className="mt-3 text-xl font-semibold">{m.name.split(" (")[0]}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{m.tagline}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Open mission <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Heritage timeline */}
      <section className="mx-auto max-w-5xl px-6 mt-24">
        <h2 className="text-3xl md:text-4xl font-bold">ISRO heritage</h2>
        <p className="mt-2 text-muted-foreground">The milestones that built the programme.</p>
        <div className="mt-10 relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent" />
          <ul className="space-y-6">
            {HERITAGE.map((m) => (
              <li key={m.name} className="relative pl-12">
                <span className="absolute left-2.5 top-2 h-3 w-3 rounded-full bg-accent shadow-glow animate-pulse-glow" />
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-primary">{m.year}</span>
                    <span className="text-lg font-semibold">{m.name}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{m.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
