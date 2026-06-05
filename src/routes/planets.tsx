import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClientCanvas } from "@/components/three/ClientCanvas";
import { StarField } from "@/components/three/StarField";
import { PlanetScene, type Hotspot } from "@/components/three/PlanetScene";
import { MousePointerClick } from "lucide-react";

export const Route = createFileRoute("/planets")({
  head: () => ({
    meta: [
      { title: "The Planets — Cosmoverse" },
      { name: "description", content: "Tour all 8 planets of the Solar System in 3D. Click the glowing pins on each planet for kid-friendly facts." },
      { property: "og:title", content: "The Planets — Cosmoverse" },
      { property: "og:description", content: "Interactive 3D tour with clickable walk-throughs of Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune." },
    ],
  }),
  component: Planets,
});

interface PlanetInfo {
  key: string;
  name: string;
  color: string;
  emissive?: string;
  ring?: boolean;
  ringColor?: string;
  tagline: string;
  diameter: string;
  day: string;
  year: string;
  moons: string;
  facts: string[];
  hotspots: Hotspot[];
}

const PLANETS: PlanetInfo[] = [
  {
    key: "mercury", name: "Mercury", color: "#b1aca5",
    tagline: "The swift messenger closest to the Sun.",
    diameter: "4,879 km", day: "59 Earth days", year: "88 Earth days", moons: "0",
    facts: ["Smallest planet in the Solar System", "Temperatures swing from −180°C to 430°C", "One Mercury year is shorter than two of its days"],
    hotspots: [
      { id: "caloris", lat: 30, lon: -160, title: "Caloris Basin", fact: "A giant impact crater 1,550 km across — almost as wide as Texas!" },
      { id: "polar-ice", lat: 85, lon: 0, title: "Polar ice", fact: "Even on the hottest planet, sunless craters at the poles hold frozen water." },
    ],
  },
  {
    key: "venus", name: "Venus", color: "#e8b07a", emissive: "#d28848",
    tagline: "Earth's scorching, cloud-wrapped twin.",
    diameter: "12,104 km", day: "243 Earth days", year: "225 Earth days", moons: "0",
    facts: ["Hottest planet at ~465°C", "Spins backwards compared to most planets", "Its clouds are made of sulfuric acid"],
    hotspots: [
      { id: "maxwell", lat: 65, lon: 3, title: "Maxwell Montes", fact: "The tallest mountain on Venus — 11 km high, even taller than Everest." },
      { id: "clouds", lat: -10, lon: 100, title: "Acid clouds", fact: "Yellowish clouds of sulfuric acid hide the surface and trap heat." },
    ],
  },
  {
    key: "earth", name: "Earth", color: "#3a8dff",
    tagline: "The pale blue dot we call home.",
    diameter: "12,742 km", day: "24 hours", year: "365.25 days", moons: "1",
    facts: ["The only known world with life", "71% of its surface is water", "Its magnetic field protects us from solar wind"],
    hotspots: [
      { id: "amazon", lat: -3, lon: -60, title: "Amazon rainforest", fact: "Produces 6% of Earth's oxygen and is home to 10% of all known species." },
      { id: "himalayas", lat: 28, lon: 84, title: "The Himalayas", fact: "Home to Mount Everest — 8,848 m tall and still growing!" },
      { id: "pacific", lat: 0, lon: -160, title: "Pacific Ocean", fact: "Bigger than all of Earth's land combined." },
    ],
  },
  {
    key: "mars", name: "Mars", color: "#d2532f",
    tagline: "The rusty desert world with giant volcanoes.",
    diameter: "6,779 km", day: "24h 37m", year: "687 Earth days", moons: "2",
    facts: ["Home to Olympus Mons — the Solar System's tallest volcano", "A day on Mars is called a 'sol'", "Has polar ice caps of frozen water and CO₂"],
    hotspots: [
      { id: "olympus", lat: 18, lon: -134, title: "Olympus Mons", fact: "A volcano 22 km tall — three times the height of Everest." },
      { id: "valles", lat: -14, lon: -60, title: "Valles Marineris", fact: "A canyon 4,000 km long — as long as the United States is wide." },
      { id: "south-pole", lat: -85, lon: 0, title: "South polar cap", fact: "Made of frozen carbon dioxide — solid 'dry ice'." },
    ],
  },
  {
    key: "jupiter", name: "Jupiter", color: "#d8a872",
    tagline: "The king of planets — a gas giant of storms.",
    diameter: "139,820 km", day: "9h 56m", year: "12 Earth years", moons: "95+",
    facts: ["The Great Red Spot is a storm bigger than Earth", "Has the strongest magnetic field of any planet", "Could fit 1,300 Earths inside it"],
    hotspots: [
      { id: "grs", lat: -22, lon: 20, title: "Great Red Spot", fact: "A hurricane bigger than Earth that has been spinning for 350+ years." },
      { id: "moons", lat: 10, lon: -120, title: "Galilean moons", fact: "Io, Europa, Ganymede and Callisto were spotted by Galileo in 1610." },
    ],
  },
  {
    key: "saturn", name: "Saturn", color: "#e6c98a", ring: true, ringColor: "#d6b272",
    tagline: "The jewel of the Solar System.",
    diameter: "116,460 km", day: "10h 42m", year: "29 Earth years", moons: "146+",
    facts: ["Its rings are made of ice and rock", "It's so light, it would float on water", "Titan, its largest moon, has lakes of liquid methane"],
    hotspots: [
      { id: "hex", lat: 78, lon: 0, title: "Hexagon storm", fact: "A six-sided cloud pattern at the north pole — wider than two Earths." },
      { id: "rings", lat: 0, lon: 90, title: "The famous rings", fact: "Mostly ice chunks ranging from grains of sand to house-sized boulders." },
    ],
  },
  {
    key: "uranus", name: "Uranus", color: "#9fdfe8", ring: true, ringColor: "#7fbfd0",
    tagline: "The tilted ice giant rolling on its side.",
    diameter: "50,724 km", day: "17 hours", year: "84 Earth years", moons: "27",
    facts: ["Rotates on its side at 98°", "Coldest planetary atmosphere at −224°C", "First planet discovered with a telescope"],
    hotspots: [
      { id: "tilt", lat: 80, lon: 30, title: "Sideways spin", fact: "Uranus is tipped so far over that it rolls along its orbit like a ball." },
      { id: "miranda", lat: -20, lon: -100, title: "Miranda's cliffs", fact: "Its moon Miranda has cliffs 20 km tall — the tallest in the Solar System." },
    ],
  },
  {
    key: "neptune", name: "Neptune", color: "#4868c8",
    tagline: "The windy blue world at the edge.",
    diameter: "49,244 km", day: "16 hours", year: "165 Earth years", moons: "14",
    facts: ["Winds blow at 2,100 km/h", "Discovered through mathematics before being seen", "Its moon Triton orbits backwards"],
    hotspots: [
      { id: "dark", lat: -20, lon: -30, title: "Great Dark Spot", fact: "A storm the size of Earth, first seen by Voyager 2 in 1989." },
      { id: "triton", lat: 30, lon: 110, title: "Triton", fact: "An icy moon that orbits backwards — it was probably captured from the Kuiper Belt." },
    ],
  },
];

function Planets() {
  const [active, setActive] = useState(2);
  const p = PLANETS[active];

  return (
    <div className="relative pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <header className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Chapter 01</p>
          <h1 className="mt-3 text-5xl md:text-6xl font-bold">The Planets</h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Eight worlds dance around our Sun. Pick one to spin it, then tap the glowing pins to discover its secrets.
          </p>
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
