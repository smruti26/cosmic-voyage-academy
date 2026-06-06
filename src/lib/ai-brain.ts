// Local "AI" knowledge base + smart helpers — no backend required.
// Powers the Space Tutor chat, recommender, fact-of-the-day, etc.

import { PLANETS, type PlanetInfo } from "@/data/planets";
import { MISSIONS } from "@/data/missions";

export interface KBEntry {
  topic: string;
  keywords: string[];
  answer: string;
}

export const KNOWLEDGE: KBEntry[] = [
  { topic: "Sun", keywords: ["sun", "star", "solar"], answer: "The Sun is a 4.6 billion-year-old yellow dwarf star. It converts 4 million tonnes of matter into pure energy every single second!" },
  { topic: "Moon", keywords: ["moon", "luna"], answer: "Earth's Moon formed when a Mars-sized world smashed into baby Earth 4.5 billion years ago. It's slowly drifting away — about 3.8 cm per year." },
  { topic: "Black Hole", keywords: ["black hole", "blackhole", "event horizon", "singularity"], answer: "A black hole is a place where gravity is so strong that not even light can escape. The edge is called the event horizon — once you cross it, you can never come back." },
  { topic: "Milky Way", keywords: ["milky way", "galaxy", "spiral"], answer: "The Milky Way is our home galaxy. It has 200–400 billion stars spinning around a supermassive black hole called Sagittarius A*." },
  { topic: "Mercury", keywords: ["mercury"], answer: "Mercury is the smallest planet and the closest to the Sun. A year there is only 88 Earth days!" },
  { topic: "Venus", keywords: ["venus"], answer: "Venus is the hottest planet at 465°C and it spins backwards — the Sun rises in the west!" },
  { topic: "Earth", keywords: ["earth", "home", "blue planet"], answer: "Earth is the only planet we know of with life. 71% of it is covered in water." },
  { topic: "Mars", keywords: ["mars", "red planet"], answer: "Mars is the rusty red world with the tallest volcano in the Solar System — Olympus Mons, 22 km high!" },
  { topic: "Jupiter", keywords: ["jupiter"], answer: "Jupiter is the king of planets — so big 1,300 Earths could fit inside it. The Great Red Spot is a storm bigger than Earth." },
  { topic: "Saturn", keywords: ["saturn", "rings"], answer: "Saturn is famous for its rings, made of ice and rock. It's so light it could float in a giant bathtub of water." },
  { topic: "Uranus", keywords: ["uranus"], answer: "Uranus rolls on its side! It's tilted by 98°, so its poles take turns facing the Sun." },
  { topic: "Neptune", keywords: ["neptune"], answer: "Neptune has the fastest winds in the Solar System — 2,100 km/h, faster than a jet!" },
  { topic: "Asteroids", keywords: ["asteroid", "belt"], answer: "Asteroids are rocky leftovers from when the Solar System formed. Most live in the asteroid belt between Mars and Jupiter." },
  { topic: "Comets", keywords: ["comet"], answer: "Comets are giant snowballs of ice and dust. When they get close to the Sun they grow glowing tails millions of km long." },
  { topic: "ISRO", keywords: ["isro", "india", "indian space"], answer: "ISRO is the Indian Space Research Organisation. It has reached the Moon, Mars, and the Sun — often on the first try!" },
  { topic: "Chandrayaan-3", keywords: ["chandrayaan", "vikram", "pragyan"], answer: "Chandrayaan-3 landed Vikram near the Moon's south pole on 23 Aug 2023 — a world first!" },
  { topic: "Mangalyaan", keywords: ["mangalyaan", "mars orbiter"], answer: "Mangalyaan made India the first country to reach Mars on its very first try, in 2014." },
  { topic: "Aditya-L1", keywords: ["aditya", "l1", "lagrange"], answer: "Aditya-L1 is India's first Sun-watching observatory, parked 1.5 million km from Earth at Lagrange Point 1." },
  { topic: "Gaganyaan", keywords: ["gaganyaan", "vyomanaut", "astronaut"], answer: "Gaganyaan will carry Indian astronauts — called Vyomanauts — to space in India's own human-rated rocket." },
  { topic: "Nebula", keywords: ["nebula", "stellar nursery"], answer: "Nebulae are colorful clouds of gas and dust where new stars are born." },
  { topic: "Light year", keywords: ["light year", "lightyear", "distance"], answer: "A light-year is how far light travels in one year — about 9.5 trillion km. The nearest star to the Sun is 4.2 light-years away." },
  { topic: "Universe", keywords: ["universe", "cosmos", "big bang"], answer: "The universe began 13.8 billion years ago in a hot, dense moment called the Big Bang — and it's still expanding today." },
];

// Fuzzy match a kid's question to the knowledge base
export function answerQuestion(question: string): string {
  const q = question.toLowerCase();
  let best: { entry: KBEntry; score: number } | null = null;
  for (const entry of KNOWLEDGE) {
    let score = 0;
    for (const kw of entry.keywords) if (q.includes(kw)) score += kw.length;
    if (score > 0 && (!best || score > best.score)) best = { entry, score };
  }
  if (best) return `🚀 ${best.entry.topic}: ${best.entry.answer}`;
  return "🤔 Hmm, I'm still learning about that! Try asking about planets, the Sun, black holes, galaxies, or ISRO missions.";
}

// Recommend next planet based on visited history
export function recommendNextPlanet(visited: string[]): PlanetInfo {
  const next = PLANETS.find((p) => !visited.includes(p.key));
  if (next) return next;
  // wrap around — recommend the most different one
  return PLANETS[(visited.length) % PLANETS.length];
}

export function recommendReason(p: PlanetInfo, visited: string[]): string {
  if (visited.length === 0) return `Start with ${p.name} — ${p.tagline.toLowerCase()}`;
  const last = PLANETS.find((pl) => pl.key === visited[visited.length - 1]);
  if (!last) return `Try ${p.name} next!`;
  const sizeRatio = p.diameterKm / last.diameterKm;
  if (sizeRatio > 5) return `You just visited ${last.name}. ${p.name} is ~${Math.round(sizeRatio)}× wider — wild jump in scale!`;
  if (sizeRatio < 0.2) return `After mighty ${last.name}, ${p.name} feels tiny — like comparing a basketball to a marble.`;
  return `${p.name} is the perfect next stop after ${last.name} — ${p.funFact}`;
}

// Recommend a mission based on completed badges
export function recommendNextMission(badges: string[]) {
  const done = new Set(badges.filter((b) => b.startsWith("mission:")).map((b) => b.slice(8)));
  const next = MISSIONS.find((m) => !done.has(m.slug));
  return next ?? MISSIONS[0];
}

// Mission readiness score 0-100
export function missionReadiness(missions: Record<string, boolean[]>): {
  score: number; rank: string; advice: string;
} {
  let done = 0, total = 0;
  for (const arr of Object.values(missions)) {
    total += arr.length;
    done += arr.filter(Boolean).length;
  }
  const score = total === 0 ? 0 : Math.round((done / total) * 100);
  let rank = "Recruit", advice = "Complete a mission checklist to begin training.";
  if (score >= 80) { rank = "Mission Commander"; advice = "You're ready to lead a crew!"; }
  else if (score >= 50) { rank = "Vyomanaut Trainee"; advice = "Finish one more mission to make Commander."; }
  else if (score >= 20) { rank = "Cadet"; advice = "Keep checking off mission steps to level up."; }
  return { score, rank, advice };
}

// Deterministic daily fun fact (rotates by date)
export function funFactOfTheDay(): string {
  const facts = [
    "Light from the Sun takes 8 minutes 20 seconds to reach Earth.",
    "Saturn has more than 146 moons — and counting!",
    "One day on Venus is longer than one year on Venus.",
    "The Sun makes up 99.86% of the mass of the entire Solar System.",
    "A spoonful of a neutron star would weigh 6 billion tons.",
    "Jupiter's moon Europa has more water than all of Earth's oceans combined.",
    "Mars's sunsets look blue — the opposite of Earth's.",
    "The Milky Way and Andromeda galaxies are going to collide in 4.5 billion years.",
    "There are more stars in the universe than grains of sand on Earth.",
    "Olympus Mons on Mars is so wide its base would cover the state of Arizona.",
  ];
  const idx = Math.floor((Date.now() / 86_400_000)) % facts.length;
  return facts[idx];
}

// "Cosmic scaler" — kid types an object, we compare it to space scales.
export function cosmicScale(input: string): string {
  const everyday: { name: string; meters: number }[] = [
    { name: "banana", meters: 0.2 },
    { name: "school bus", meters: 12 },
    { name: "football field", meters: 100 },
    { name: "blue whale", meters: 30 },
    { name: "Eiffel Tower", meters: 330 },
    { name: "Mount Everest", meters: 8848 },
    { name: "house", meters: 10 },
    { name: "car", meters: 4.5 },
    { name: "elephant", meters: 3.5 },
    { name: "person", meters: 1.7 },
  ];
  const lower = input.trim().toLowerCase();
  if (!lower) return "Type something everyday (banana, school bus, blue whale…) and I'll scale it to space!";
  const item = everyday.find((e) => lower.includes(e.name)) ?? { name: input.trim(), meters: 1 };
  const earthDiam = 12_742_000;
  const sunDiam = 1_391_400_000;
  const moonDist = 384_400_000;
  const earthsAcross = Math.round(earthDiam / item.meters).toLocaleString();
  const stackToMoon = Math.round(moonDist / item.meters).toLocaleString();
  const sunsAcross = (sunDiam / item.meters).toLocaleString(undefined, { maximumFractionDigits: 0 });
  return `If we line up ${item.name}s end-to-end: ${earthsAcross} fit across Earth, ${stackToMoon} reach the Moon, and you'd need ${sunsAcross} to stretch across the Sun.`;
}

// Star identifier (very simplified seasonal logic, northern hemisphere)
export function visibleConstellations(month: number, hemisphere: "north" | "south" = "north") {
  const map: Record<number, string[]> = {
    0: ["Orion", "Taurus", "Gemini", "Canis Major"],
    1: ["Orion", "Auriga", "Gemini", "Cancer"],
    2: ["Leo", "Cancer", "Gemini", "Ursa Major"],
    3: ["Leo", "Virgo", "Boötes", "Ursa Major"],
    4: ["Virgo", "Boötes", "Hercules", "Corona Borealis"],
    5: ["Hercules", "Lyra", "Cygnus", "Scorpius"],
    6: ["Lyra", "Cygnus", "Aquila", "Sagittarius"],
    7: ["Cygnus", "Pegasus", "Aquila", "Capricornus"],
    8: ["Pegasus", "Andromeda", "Pisces", "Aquarius"],
    9: ["Andromeda", "Perseus", "Cassiopeia", "Pisces"],
   10: ["Orion", "Taurus", "Perseus", "Cassiopeia"],
   11: ["Orion", "Taurus", "Gemini", "Auriga"],
  };
  const list = map[month] ?? ["Orion"];
  return hemisphere === "south" ? list.slice().reverse() : list;
}

// Compare-planets insights generator
export function compareInsights(a: PlanetInfo, b: PlanetInfo): string[] {
  const out: string[] = [];
  const sizeRatio = a.diameterKm / b.diameterKm;
  if (Math.abs(sizeRatio - 1) < 0.05) out.push(`${a.name} and ${b.name} are nearly twins in size!`);
  else if (sizeRatio > 1) out.push(`${a.name} is about ${sizeRatio.toFixed(1)}× wider than ${b.name}.`);
  else out.push(`${b.name} is about ${(1 / sizeRatio).toFixed(1)}× wider than ${a.name}.`);

  const distDiff = Math.abs(a.distanceAU - b.distanceAU);
  out.push(`They sit ${distDiff.toFixed(2)} AU apart — about ${(distDiff * 149.6).toFixed(0)} million km.`);

  if (a.moonsCount !== b.moonsCount) {
    const more = a.moonsCount > b.moonsCount ? a : b;
    const less = a.moonsCount > b.moonsCount ? b : a;
    out.push(`${more.name} has ${more.moonsCount} moons, ${less.name} has ${less.moonsCount}.`);
  }
  out.push(`Fun pair: ${a.funFact} ✨ ${b.funFact}`);
  return out;
}

// Adaptive narration — rewrites a sentence for the age band
export function adaptNarration(text: string, age: "5-7" | "8-10" | "11+"): string {
  if (age === "8-10") return text;
  if (age === "5-7") {
    // Shorten + simpler words
    return text
      .replace(/supermassive/gi, "super big")
      .replace(/gravitational/gi, "pulling")
      .replace(/event horizon/gi, "the edge of no return")
      .replace(/orbits?/gi, "loops around")
      .replace(/billion/gi, "lots of millions of")
      .split(/[.!?]/)[0]
      .trim() + " 🚀";
  }
  // 11+ — add a scientific framing
  return text + " (Pro tip: this is how scientists describe it too!)";
}

// Personalised achievement coach message
export function coachMessage(badges: string[], quiz: { correct: number; total: number }): string {
  const lines: string[] = [];
  if (badges.length === 0) lines.push("Welcome, explorer! Earn your first badge by completing a mission checklist.");
  else lines.push(`You've earned ${badges.length} badge${badges.length === 1 ? "" : "s"} — keep going!`);
  if (quiz.total > 0) {
    const pct = Math.round((quiz.correct / quiz.total) * 100);
    if (pct >= 80) lines.push(`Quiz champion! ${pct}% correct.`);
    else if (pct >= 50) lines.push(`Solid quiz streak (${pct}%). Try a planet you haven't visited yet.`);
    else lines.push(`Every wrong answer is a new fact learned. Try another quiz!`);
  }
  return lines.join(" ");
}
