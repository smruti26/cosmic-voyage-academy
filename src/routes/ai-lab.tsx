import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  funFactOfTheDay, recommendNextPlanet, recommendReason, recommendNextMission,
  missionReadiness, cosmicScale, visibleConstellations, adaptNarration, coachMessage,
} from "@/lib/ai-brain";
import { useProfile, type AgeBand } from "@/lib/profile";
import { Sparkles, Rocket, Telescope, Ruler, Star, Award, BrainCircuit, Globe, Stars, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/ai-lab")({
  head: () => ({
    meta: [
      { title: "AI Lab — Cosmoverse" },
      { name: "description", content: "Ten AI-powered features for young space explorers: tutor chat, planet recommender, adaptive narration, cosmic scaler, star identifier and more." },
      { property: "og:title", content: "AI Lab — Cosmoverse" },
      { property: "og:description", content: "Personalised AI tools to explore the universe." },
    ],
  }),
  component: AILab,
});

function AILab() {
  const { profile, update } = useProfile();
  const fact = useMemo(() => funFactOfTheDay(), []);
  const nextPlanet = recommendNextPlanet(profile.visitedPlanets);
  const nextMission = recommendNextMission(profile.badges);
  const readiness = missionReadiness(profile.missions);

  const [scaleInput, setScaleInput] = useState("blue whale");
  const scaleAnswer = cosmicScale(scaleInput);

  const [month, setMonth] = useState(new Date().getMonth());
  const [hemisphere, setHemisphere] = useState<"north" | "south">("north");
  const constellations = visibleConstellations(month, hemisphere);

  const [narrationDemo] = useState("A supermassive black hole at the centre of our galaxy bends light gravitationally.");

  const ageBands: { id: AgeBand; label: string }[] = [
    { id: "5-7", label: "Ages 5–7" }, { id: "8-10", label: "Ages 8–10" }, { id: "11+", label: "Ages 11+" },
  ];

  return (
    <div className="relative pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent inline-flex items-center gap-2">
            <BrainCircuit className="h-3.5 w-3.5" /> AI Lab · 10 smart features
          </p>
          <h1 className="mt-3 text-5xl md:text-6xl font-bold">Your AI co-pilot</h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Ten AI-powered tools that personalise your space adventure. All run instantly in your browser — no setup needed.
          </p>
        </header>

        {/* PROFILE strip */}
        <div className="mt-10 glass rounded-3xl p-5 sm:p-6 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-nebula shadow-glow text-xl">🚀</span>
            <div>
              <input
                value={profile.name}
                onChange={(e) => update({ name: e.target.value })}
                className="bg-transparent border-b border-white/10 focus:border-primary focus:outline-none font-semibold text-lg"
              />
              <div className="text-xs text-muted-foreground">{readiness.rank} · {profile.badges.length} badge{profile.badges.length === 1 ? "" : "s"}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Reading level:</span>
            {ageBands.map((a) => (
              <button
                key={a.id}
                onClick={() => update({ ageBand: a.id })}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  profile.ageBand === a.id ? "bg-primary/20 border-primary text-foreground" : "border-white/10 text-muted-foreground hover:bg-white/5"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Tutor (cross-link) */}
          <FeatureCard Icon={MessageCircle} tag="01 · Space Tutor" title="Ask Cosmo anything">
            <p>Use the floating <span className="font-semibold text-foreground">Ask Cosmo</span> button (bottom-right) to ask any space question and get a kid-friendly answer.</p>
          </FeatureCard>

          {/* 2. Planet recommender */}
          <FeatureCard Icon={Globe} tag="02 · Planet Recommender" title={`Try ${nextPlanet.name} next`}>
            <p className="text-sm">{recommendReason(nextPlanet, profile.visitedPlanets)}</p>
            <Link to="/planets" className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">Visit {nextPlanet.name} →</Link>
          </FeatureCard>

          {/* 3. Adaptive narration */}
          <FeatureCard Icon={BrainCircuit} tag="03 · Adaptive Narration" title="Same fact, your level">
            <p className="italic text-foreground">"{adaptNarration(narrationDemo, profile.ageBand)}"</p>
            <p className="mt-2 text-xs text-muted-foreground">Switch reading level above to see narration adapt.</p>
          </FeatureCard>

          {/* 4. Quiz generator */}
          <FeatureCard Icon={Sparkles} tag="04 · Smart Quizzes" title="Test what you learned">
            <p>Click any glowing pin on a planet to get a personalised mini-quiz. You've answered <span className="font-semibold text-foreground">{profile.quizScore.correct}/{profile.quizScore.total}</span> correctly.</p>
            <Link to="/planets" className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">Take a quiz →</Link>
          </FeatureCard>

          {/* 5. Mission readiness */}
          <FeatureCard Icon={Rocket} tag="05 · Mission Readiness" title={`Score: ${readiness.score}/100`}>
            <p className="font-semibold text-foreground">{readiness.rank}</p>
            <p className="mt-1 text-xs">{readiness.advice}</p>
            <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full" style={{ width: `${readiness.score}%`, background: "var(--gradient-aurora)" }} />
            </div>
          </FeatureCard>

          {/* 6. Mission recommender */}
          <FeatureCard Icon={Award} tag="06 · Next Mission" title={`Suit up for ${nextMission.name.split(" (")[0]}`}>
            <p className="text-sm">{nextMission.tagline}</p>
            <Link to="/isro/$mission" params={{ mission: nextMission.slug }} className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">Open mission →</Link>
          </FeatureCard>

          {/* 7. Fun fact of the day */}
          <FeatureCard Icon={Star} tag="07 · Fact of the Day" title="Today's cosmic morsel">
            <p>{fact}</p>
          </FeatureCard>

          {/* 8. Cosmic scaler */}
          <FeatureCard Icon={Ruler} tag="08 · Cosmic Scaler" title="Scale anything to space">
            <input
              value={scaleInput}
              onChange={(e) => setScaleInput(e.target.value)}
              placeholder="banana, school bus, blue whale…"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
            />
            <p className="mt-3 text-sm">{scaleAnswer}</p>
          </FeatureCard>

          {/* 9. Star identifier */}
          <FeatureCard Icon={Telescope} tag="09 · Tonight's Sky" title="What can I see?">
            <div className="flex items-center gap-2 text-xs">
              <select value={month} onChange={(e) => setMonth(+e.target.value)} className="rounded-lg bg-white/5 border border-white/10 px-2 py-1.5">
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
              <button onClick={() => setHemisphere((h) => h === "north" ? "south" : "north")} className="rounded-lg bg-white/5 border border-white/10 px-2 py-1.5">
                {hemisphere === "north" ? "Northern" : "Southern"}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {constellations.map((c) => (
                <span key={c} className="text-xs rounded-full bg-primary/15 text-primary px-2.5 py-1">{c}</span>
              ))}
            </div>
          </FeatureCard>

          {/* 10. Coach */}
          <FeatureCard Icon={Stars} tag="10 · Achievement Coach" title="Your encouragement">
            <p>{coachMessage(profile.badges, profile.quizScore)}</p>
            {profile.badges.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.badges.slice(0, 8).map((b) => (
                  <span key={b} className="text-[10px] rounded-full bg-white/5 px-2 py-0.5 text-muted-foreground">{b}</span>
                ))}
              </div>
            )}
          </FeatureCard>
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground">
          All AI features run client-side using on-device logic and your saved profile. No backend, no signup.
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  Icon, tag, title, children,
}: { Icon: typeof Globe; tag: string; title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-5 hover:bg-white/[0.03] transition border border-white/5">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-accent">
        <Icon className="h-3.5 w-3.5" /> {tag}
      </div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <div className="mt-2 text-sm text-muted-foreground space-y-2">{children}</div>
    </div>
  );
}
