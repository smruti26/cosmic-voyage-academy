import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ClientCanvas } from "@/components/three/ClientCanvas";
import { StarField } from "@/components/three/StarField";
import { Spacecraft3D } from "@/components/three/Spacecraft3D";
import { getMission, MISSIONS, type Mission } from "@/data/missions";
import { useProfile } from "@/lib/profile";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Sparkles, Award } from "lucide-react";

export const Route = createFileRoute("/isro/$mission")({
  loader: ({ params }) => {
    const mission = getMission(params.mission);
    if (!mission) throw notFound();
    return { mission };
  },
  head: ({ loaderData }) => {
    const m = loaderData?.mission;
    if (!m) return { meta: [{ title: "Mission — Cosmoverse" }] };
    return {
      meta: [
        { title: `${m.name} — ISRO Mission · Cosmoverse` },
        { name: "description", content: `${m.tagline} Explore the timeline, spacecraft and mission checklist in 3D.` },
        { property: "og:title", content: `${m.name} — ISRO Mission` },
        { property: "og:description", content: m.tagline },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="pt-32 pb-20 mx-auto max-w-2xl px-6 text-center">
      <h1 className="text-3xl font-bold text-aurora">Mission not found</h1>
      <p className="mt-3 text-muted-foreground">That mission isn't in our catalog yet.</p>
      <Link to="/isro" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
        <ArrowLeft className="h-4 w-4" /> All missions
      </Link>
    </div>
  ),
  component: MissionPage,
});

function MissionPage() {
  const { mission } = Route.useLoaderData() as { mission: Mission };
  const { profile, setMissionStep } = useProfile();
  const checkedArr = profile.missions[mission.slug] ?? new Array(mission.checklist.length).fill(false);

  const toggle = (i: number) => {
    setMissionStep(mission.slug, i, !checkedArr[i], mission.checklist.length);
  };

  const completed = checkedArr.filter(Boolean).length;
  const pct = Math.round((completed / mission.checklist.length) * 100);
  const earned = profile.badges.includes(`mission:${mission.slug}`);

  const idx = MISSIONS.findIndex((m) => m.slug === mission.slug);
  const prev = MISSIONS[(idx - 1 + MISSIONS.length) % MISSIONS.length];
  const next = MISSIONS[(idx + 1) % MISSIONS.length];


  return (
    <div className="relative pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <Link to="/isro" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> All ISRO missions
        </Link>

        <div className="mt-6 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em]">
              <span className="text-accent">{mission.category}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground font-mono">{mission.year}</span>
            </div>
            <h1 className="mt-3 text-5xl md:text-6xl font-bold leading-[1.05]">
              <span className="text-aurora">{mission.name.split(" (")[0]}</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{mission.tagline}</p>
            <p className="mt-3 text-base text-muted-foreground/90">{mission.hero}</p>

            <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {mission.facts.map((f) => (
                <div key={f.k} className="glass rounded-2xl p-3">
                  <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.k}</dt>
                  <dd className="mt-1 text-sm font-semibold">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative aspect-square w-full glass rounded-3xl overflow-hidden">
            <ClientCanvas camera={{ position: [3.2, 1.4, 4], fov: 45 }} dpr={[1, 1.8]}>
              <color attach="background" args={["#06041a"]} />
              <ambientLight intensity={0.35} />
              <directionalLight position={[5, 5, 5]} intensity={1.2} />
              <StarField count={1200} radius={40} />
              <Spacecraft3D type={mission.craft} accent={mission.accent} />
            </ClientCanvas>
            <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-accent" /> 3D · {mission.craft}
            </div>
          </div>
        </div>

        {/* Story */}
        <section className="mt-16 max-w-3xl space-y-4">
          {mission.story.map((p, i) => (
            <p key={i} className="text-base text-muted-foreground leading-relaxed">{p}</p>
          ))}
        </section>

        {/* Timeline + Checklist side by side */}
        <div className="mt-16 grid lg:grid-cols-5 gap-8">
          {/* Timeline */}
          <section className="lg:col-span-3">
            <h2 className="text-2xl md:text-3xl font-bold">Mission timeline</h2>
            <ol className="mt-6 relative border-l border-white/10 pl-6 space-y-5">
              {mission.timeline.map((t, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[34px] top-1 h-3 w-3 rounded-full bg-accent shadow-glow animate-pulse-glow" />
                  <div className="glass rounded-xl p-4">
                    <div className="text-xs font-mono text-primary">{t.date}</div>
                    <div className="mt-1 text-sm">{t.event}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Checklist */}
          <section className="lg:col-span-2">
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Astronaut checklist</h2>
                <span className="text-xs text-muted-foreground">{completed} / {mission.checklist.length}</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full transition-[width] duration-300" style={{ width: `${pct}%`, background: "var(--gradient-aurora)" }} />
              </div>
              <ul className="mt-5 space-y-2">
                {mission.checklist.map((item, i) => {
                  const done = !!checked[i];
                  return (
                    <li key={i}>
                      <button
                        onClick={() => toggle(i)}
                        className={`group w-full text-left flex items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm transition ${
                          done ? "bg-primary/10 text-foreground" : "hover:bg-white/5 text-muted-foreground"
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                        ) : (
                          <Circle className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
                        )}
                        <span className={done ? "line-through opacity-80" : ""}>{item}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {pct === 100 && (
                <div className="mt-4 rounded-xl bg-primary/15 px-3 py-2 text-sm text-foreground">
                  🚀 Mission accomplished! You've earned your Vyomanaut badge.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Prev / next */}
        <div className="mt-16 grid sm:grid-cols-2 gap-4">
          <Link
            to="/isro/$mission"
            params={{ mission: prev.slug }}
            className="group glass rounded-2xl p-5 hover:bg-white/5"
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-1.5">
              <ArrowLeft className="h-3 w-3" /> Previous mission
            </div>
            <div className="mt-2 text-lg font-semibold group-hover:text-aurora">{prev.name.split(" (")[0]}</div>
          </Link>
          <Link
            to="/isro/$mission"
            params={{ mission: next.slug }}
            className="group glass rounded-2xl p-5 hover:bg-white/5 sm:text-right"
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-1.5 sm:justify-end">
              Next mission <ArrowRight className="h-3 w-3" />
            </div>
            <div className="mt-2 text-lg font-semibold group-hover:text-aurora">{next.name.split(" (")[0]}</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
