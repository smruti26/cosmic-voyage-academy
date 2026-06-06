import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, X, Sparkles, Rocket, Globe2, Orbit, Aperture } from "lucide-react";
import { useProfile } from "@/lib/profile";
import { adaptNarration } from "@/lib/ai-brain";

export interface JourneyStep {
  route: string;
  title: string;
  narration: string;
  highlight?: string;
}

export type JourneyPath = "all" | "planets" | "galaxies" | "black-holes";

const TRACKS: Record<JourneyPath, JourneyStep[]> = {
  all: [
    { route: "/",            title: "Mission Briefing",        narration: "Welcome, explorer! You're about to travel through our Solar System, dive into a black hole, and ride alongside India's most daring spacecraft. Ready? Let's launch!", highlight: "Press 'Next' to lift off." },
    { route: "/planets",     title: "The Eight Worlds",        narration: "Our Sun keeps eight planets in orbit. The four rocky ones live close in. The four giants live way out in the cold. Spin Earth, then click the dots to discover what makes it special.", highlight: "Tap a planet, then a glowing pin." },
    { route: "/galaxy",      title: "Inside the Milky Way",    narration: "Our Sun is just one of 200 billion stars swirling in a giant pinwheel called the Milky Way. We orbit a supermassive black hole at the center — one full lap takes 230 million years!", highlight: "Watch the spiral arms rotate." },
    { route: "/black-holes", title: "Crossing the Event Horizon", narration: "When a giant star dies, gravity can squash it into a single point. Scroll down and watch the disk swirl faster — that's hot gas being ripped apart before it falls in forever.", highlight: "Scroll to intensify gravity." },
    { route: "/stars",       title: "Where Stars Are Born",    narration: "Stars are born inside colorful clouds called nebulae. Our Sun is a 'G-type' star — middle-sized, middle-aged, and just right for life on Earth.", highlight: "Each color is a different temperature." },
    { route: "/isro",        title: "India Reaches the Stars", narration: "ISRO has sent missions to the Moon, Mars, and even the Sun. Click any mission below to suit up and explore it.", highlight: "Open a mission card to continue." },
  ],
  planets: [
    { route: "/",            title: "Planet Pathway",          narration: "Strap in! We're zooming through all eight planets — from rocky Mercury to icy Neptune.", highlight: "Press Next to begin the planet tour." },
    { route: "/planets",     title: "Spin the Worlds",         narration: "Pick a planet, give it a spin, and tap the glowing pins for kid-sized facts. Don't miss the quick quiz!", highlight: "Try the pop-up quizzes." },
    { route: "/compare",     title: "Compare Two Planets",     narration: "Now line up two planets side-by-side. See who's bigger, who's farther, and who has more moons!", highlight: "Pick two planets to compare." },
    { route: "/ai-lab",      title: "Planet Recommender",      narration: "Our AI brain will pick your next planet adventure based on what you've already explored.", highlight: "Check 'AI Lab' for personalised picks." },
  ],
  galaxies: [
    { route: "/",            title: "Galactic Pathway",        narration: "Get ready to leave our Solar System far behind. We're going galactic!", highlight: "Press Next to fly out of the system." },
    { route: "/galaxy",      title: "Inside the Milky Way",    narration: "Our home galaxy holds 200–400 billion stars. We live on a quiet spiral arm called the Orion Arm.", highlight: "Watch the spiral arms swirl." },
    { route: "/stars",       title: "Stellar Nurseries",       narration: "Galaxies are full of nebulae — colorful clouds where new stars are born.", highlight: "Each color = a star's temperature." },
    { route: "/ai-lab",      title: "Tonight's Sky",           narration: "Our star identifier suggests which constellations you can spot from your backyard right now.", highlight: "Open the AI Lab to see your sky." },
  ],
  "black-holes": [
    { route: "/",            title: "Gravity's Mystery",       narration: "Some objects bend space itself. Today we're going to meet the most extreme one of all.", highlight: "Press Next to approach the singularity." },
    { route: "/black-holes", title: "Crossing the Event Horizon", narration: "A black hole's gravity is so strong even light can't escape. Scroll down and watch the disk swirl faster!", highlight: "Scroll slowly to feel the pull." },
    { route: "/stars",       title: "How They Form",           narration: "Most black holes start as giant stars that ran out of fuel. Gravity wins, and they collapse forever.", highlight: "See the life cycle of stars." },
    { route: "/ai-lab",      title: "Ask Cosmo",               narration: "Got a black-hole question burning bright? Ask our space tutor anything!", highlight: "Open AI Lab → Space Tutor." },
  ],
};

interface JourneyContextValue {
  active: boolean;
  step: number;
  steps: JourneyStep[];
  path: JourneyPath | null;
  pickPath: (p: JourneyPath) => void;
  start: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  goto: (i: number) => void;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [path, setPath] = useState<JourneyPath | null>(null);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const steps = path ? TRACKS[path] : [];

  const goto = useCallback((i: number) => {
    if (!path) return;
    const list = TRACKS[path];
    const clamped = Math.max(0, Math.min(list.length - 1, i));
    setStep(clamped);
    const target = list[clamped].route;
    if (target !== pathname) navigate({ to: target });
  }, [navigate, pathname, path]);

  const start = useCallback(() => { setActive(true); setPath(null); setStep(0); }, []);
  const stop  = useCallback(() => { setActive(false); setPath(null); setStep(0); }, []);
  const next  = useCallback(() => goto(step + 1), [goto, step]);
  const prev  = useCallback(() => goto(step - 1), [goto, step]);
  const pickPath = useCallback((p: JourneyPath) => { setPath(p); setStep(0); navigate({ to: TRACKS[p][0].route }); }, [navigate]);

  const value = useMemo<JourneyContextValue>(() => ({
    active, step, steps, path, pickPath, start, stop, next, prev, goto,
  }), [active, step, steps, path, pickPath, start, stop, next, prev, goto]);

  return (
    <JourneyContext.Provider value={value}>
      {children}
      {active && (path ? <JourneyOverlay /> : <PathPicker />)}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error("useJourney must be used within JourneyProvider");
  return ctx;
}

function PathPicker() {
  const { pickPath, stop } = useJourney();
  const { update } = useProfile();
  const choices: { key: JourneyPath; label: string; desc: string; Icon: typeof Globe2 }[] = [
    { key: "planets",      label: "Planets",      desc: "Tour the 8 worlds, take quizzes, compare two planets.", Icon: Globe2 },
    { key: "galaxies",     label: "Galaxies",     desc: "Fly through the Milky Way and meet stellar nurseries.", Icon: Orbit },
    { key: "black-holes",  label: "Black Holes",  desc: "Approach the event horizon with cinematic intensity.", Icon: Aperture },
    { key: "all",          label: "Grand Tour",   desc: "See everything — planets, galaxies, black holes, ISRO.", Icon: Rocket },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in" onClick={stop}>
      <div className="glass max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-nebula" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent">
            <Sparkles className="h-3.5 w-3.5" /> Choose your path
          </div>
          <button onClick={stop} className="rounded-full p-1.5 hover:bg-white/10" aria-label="Cancel">
            <X className="h-4 w-4" />
          </button>
        </div>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold">Where should we begin, explorer?</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">Pick a path and we'll tailor the narration just for you.</p>
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          {choices.map(({ key, label, desc, Icon }) => (
            <button
              key={key}
              onClick={() => { update({ journeyPath: key }); pickPath(key); }}
              className="text-left glass rounded-2xl p-4 hover:bg-white/5 transition group border border-white/5 hover:border-primary/40"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                <div className="font-semibold">{label}</div>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function JourneyOverlay() {
  const { step, steps, next, prev, stop } = useJourney();
  const { profile, visitRoute } = useProfile();
  const s = steps[step];
  const isLast = step === steps.length - 1;
  const isFirst = step === 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") stop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, stop]);

  useEffect(() => { if (s) visitRoute(s.route); }, [s, visitRoute]);

  if (!s) return null;
  const narration = adaptNarration(s.narration, profile.ageBand);

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] pointer-events-none">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pointer-events-auto">
        <div className="glass rounded-3xl p-5 sm:p-6 mb-4 shadow-nebula animate-fade-in">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Guided Journey · {step + 1}/{steps.length}
            </div>
            <button onClick={stop} className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/10" aria-label="End journey">
              <X className="h-4 w-4" />
            </button>
          </div>

          <h3 className="mt-3 text-2xl sm:text-3xl font-bold leading-tight">{s.title}</h3>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">{narration}</p>
          {s.highlight && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs text-primary">
              <Rocket className="h-3.5 w-3.5" /> {s.highlight}
            </div>
          )}

          <div className="mt-5 flex items-center gap-1.5">
            {steps.map((_, i) => (
              <span key={i} className="h-1 flex-1 rounded-full transition" style={i <= step ? { background: "var(--gradient-aurora)" } : { background: "rgba(255,255,255,0.1)" }} />
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button onClick={prev} disabled={isFirst} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium border border-white/10 disabled:opacity-40 hover:bg-white/5">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {isLast ? (
              <button onClick={stop} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow">Finish journey</button>
            ) : (
              <button onClick={next} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow">Next <ArrowRight className="h-4 w-4" /></button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function JourneyLauncher({ className = "" }: { className?: string }) {
  const { start, active } = useJourney();
  if (active) return null;
  return (
    <button
      onClick={start}
      className={`inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.03] transition ${className}`}
    >
      <Rocket className="h-4 w-4" /> Start guided journey
    </button>
  );
}
