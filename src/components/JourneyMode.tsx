import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, X, Sparkles, Rocket } from "lucide-react";

export interface JourneyStep {
  route: string;
  title: string;
  narration: string;
  highlight?: string;
}

const STEPS: JourneyStep[] = [
  { route: "/",            title: "Mission Briefing",        narration: "Welcome, explorer! You're about to travel through our Solar System, dive into a black hole, and ride alongside India's most daring spacecraft. Ready? Let's launch!", highlight: "Press 'Next' to lift off." },
  { route: "/planets",     title: "The Eight Worlds",        narration: "Our Sun keeps eight planets in orbit. The four rocky ones live close in. The four giants live way out in the cold. Spin Earth, then click the dots to discover what makes it special.", highlight: "Tap a planet, then click a glowing pin." },
  { route: "/galaxy",      title: "Inside the Milky Way",    narration: "Our Sun is just one of 200 billion stars swirling in a giant pinwheel called the Milky Way. We orbit a supermassive black hole at the center — one full lap takes 230 million years!", highlight: "Watch the spiral arms rotate." },
  { route: "/black-holes", title: "Crossing the Event Horizon", narration: "When a giant star dies, gravity can squash it into a single point. Scroll down and watch the disk swirl faster — that's hot gas being ripped apart before it falls in forever.", highlight: "Scroll to intensify the gravity." },
  { route: "/stars",       title: "Where Stars Are Born",    narration: "Stars are born inside colorful clouds called nebulae. Our Sun is a 'G-type' star — middle-sized, middle-aged, and just right for life on Earth.", highlight: "Each color is a different temperature." },
  { route: "/isro",        title: "India Reaches the Stars", narration: "ISRO has sent missions to the Moon, Mars, and even the Sun. Click any mission below to suit up and explore it.", highlight: "Open a mission card to continue." },
];

interface JourneyContextValue {
  active: boolean;
  step: number;
  steps: JourneyStep[];
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
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const goto = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(STEPS.length - 1, i));
    setStep(clamped);
    const target = STEPS[clamped].route;
    if (target !== pathname) navigate({ to: target });
  }, [navigate, pathname]);

  const start = useCallback(() => { setActive(true); goto(0); }, [goto]);
  const stop  = useCallback(() => setActive(false), []);
  const next  = useCallback(() => goto(step + 1), [goto, step]);
  const prev  = useCallback(() => goto(step - 1), [goto, step]);

  const value = useMemo<JourneyContextValue>(() => ({
    active, step, steps: STEPS, start, stop, next, prev, goto,
  }), [active, step, start, stop, next, prev, goto]);

  return (
    <JourneyContext.Provider value={value}>
      {children}
      {active && <JourneyOverlay />}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error("useJourney must be used within JourneyProvider");
  return ctx;
}

function JourneyOverlay() {
  const { step, steps, next, prev, stop } = useJourney();
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

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] pointer-events-none">
      {/* progress rail */}
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
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">{s.narration}</p>
          {s.highlight && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs text-primary">
              <Rocket className="h-3.5 w-3.5" /> {s.highlight}
            </div>
          )}

          {/* progress dots */}
          <div className="mt-5 flex items-center gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full transition ${i <= step ? "bg-aurora-fill" : "bg-white/10"}`}
                style={i <= step ? { background: "var(--gradient-aurora)" } : undefined}
              />
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              onClick={prev}
              disabled={isFirst}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium border border-white/10 disabled:opacity-40 hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {isLast ? (
              <button onClick={stop} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
                Finish journey
              </button>
            ) : (
              <button onClick={next} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
                Next <ArrowRight className="h-4 w-4" />
              </button>
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
