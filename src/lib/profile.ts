// Lightweight client-side profile stored in localStorage.
// No backend required — kid-friendly progress tracking.

import { useEffect, useState, useCallback } from "react";

const KEY = "cosmoverse:profile:v1";

export type AgeBand = "5-7" | "8-10" | "11+";

export interface Profile {
  name: string;
  ageBand: AgeBand;
  badges: string[];                                    // e.g. mission slugs / planet keys / quiz wins
  visitedPlanets: string[];                            // planet keys
  visitedRoutes: string[];                             // routes visited
  quizScore: { correct: number; total: number };
  missions: Record<string, boolean[]>;                 // slug -> per-step done
  journeyPath: "all" | "planets" | "galaxies" | "black-holes";
  createdAt: number;
}

const defaultProfile = (): Profile => ({
  name: "Explorer",
  ageBand: "8-10",
  badges: [],
  visitedPlanets: [],
  visitedRoutes: [],
  quizScore: { correct: 0, total: 0 },
  missions: {},
  journeyPath: "all",
  createdAt: Date.now(),
});

function read(): Profile {
  if (typeof window === "undefined") return defaultProfile();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProfile();
    return { ...defaultProfile(), ...JSON.parse(raw) };
  } catch {
    return defaultProfile();
  }
}

function write(p: Profile) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent("cosmoverse:profile-changed"));
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  useEffect(() => {
    setProfile(read());
    const onChange = () => setProfile(read());
    window.addEventListener("cosmoverse:profile-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("cosmoverse:profile-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const update = useCallback((patch: Partial<Profile> | ((p: Profile) => Profile)) => {
    const current = read();
    const next = typeof patch === "function" ? patch(current) : { ...current, ...patch };
    write(next);
    setProfile(next);
  }, []);

  const addBadge = useCallback((badge: string) => {
    update((p) => p.badges.includes(badge) ? p : { ...p, badges: [...p.badges, badge] });
  }, [update]);

  const setMissionStep = useCallback((slug: string, index: number, done: boolean, total: number) => {
    update((p) => {
      const prev = p.missions[slug] ?? new Array(total).fill(false);
      const next = prev.slice(0, total);
      while (next.length < total) next.push(false);
      next[index] = done;
      const updatedMissions = { ...p.missions, [slug]: next };
      const allDone = next.every(Boolean);
      const badges = allDone && !p.badges.includes(`mission:${slug}`)
        ? [...p.badges, `mission:${slug}`]
        : p.badges;
      return { ...p, missions: updatedMissions, badges };
    });
  }, [update]);

  const visitPlanet = useCallback((key: string) => {
    update((p) => p.visitedPlanets.includes(key)
      ? p
      : { ...p, visitedPlanets: [...p.visitedPlanets, key] });
  }, [update]);

  const visitRoute = useCallback((route: string) => {
    update((p) => p.visitedRoutes.includes(route)
      ? p
      : { ...p, visitedRoutes: [...p.visitedRoutes, route] });
  }, [update]);

  const recordQuiz = useCallback((correct: boolean) => {
    update((p) => ({
      ...p,
      quizScore: { correct: p.quizScore.correct + (correct ? 1 : 0), total: p.quizScore.total + 1 },
    }));
  }, [update]);

  const reset = useCallback(() => write(defaultProfile()), []);

  return { profile, update, addBadge, setMissionStep, visitPlanet, visitRoute, recordQuiz, reset };
}
