import type { Hotspot } from "@/components/three/PlanetScene";

export interface PlanetInfo {
  key: string;
  name: string;
  color: string;
  emissive?: string;
  ring?: boolean;
  ringColor?: string;
  tagline: string;
  diameter: string;       // human-readable
  diameterKm: number;     // numeric
  distanceAU: number;     // distance from Sun in AU
  distanceKm: number;     // distance from Sun in km (avg)
  day: string;
  year: string;
  moons: string;
  moonsCount: number;
  surfaceTempC: string;   // e.g. "-180 to 430"
  gravity: string;        // m/s² as string
  funFact: string;
  facts: string[];
  hotspots: Hotspot[];
}

export const PLANETS: PlanetInfo[] = [
  {
    key: "mercury", name: "Mercury", color: "#b1aca5",
    tagline: "The swift messenger closest to the Sun.",
    diameter: "4,879 km", diameterKm: 4879, distanceAU: 0.39, distanceKm: 57_900_000,
    day: "59 Earth days", year: "88 Earth days", moons: "0", moonsCount: 0,
    surfaceTempC: "−180 to 430", gravity: "3.7 m/s²",
    funFact: "A Mercury year is shorter than two of its days.",
    facts: ["Smallest planet in the Solar System", "Temperatures swing from −180°C to 430°C", "One Mercury year is shorter than two of its days"],
    hotspots: [
      { id: "caloris", lat: 30, lon: -160, title: "Caloris Basin", fact: "A giant impact crater 1,550 km across — almost as wide as Texas!" },
      { id: "polar-ice", lat: 85, lon: 0, title: "Polar ice", fact: "Even on the hottest planet, sunless craters at the poles hold frozen water." },
    ],
  },
  {
    key: "venus", name: "Venus", color: "#e8b07a", emissive: "#d28848",
    tagline: "Earth's scorching, cloud-wrapped twin.",
    diameter: "12,104 km", diameterKm: 12104, distanceAU: 0.72, distanceKm: 108_200_000,
    day: "243 Earth days", year: "225 Earth days", moons: "0", moonsCount: 0,
    surfaceTempC: "465", gravity: "8.87 m/s²",
    funFact: "Venus spins backwards — the Sun rises in the west.",
    facts: ["Hottest planet at ~465°C", "Spins backwards compared to most planets", "Its clouds are made of sulfuric acid"],
    hotspots: [
      { id: "maxwell", lat: 65, lon: 3, title: "Maxwell Montes", fact: "The tallest mountain on Venus — 11 km high, even taller than Everest." },
      { id: "clouds", lat: -10, lon: 100, title: "Acid clouds", fact: "Yellowish clouds of sulfuric acid hide the surface and trap heat." },
    ],
  },
  {
    key: "earth", name: "Earth", color: "#3a8dff",
    tagline: "The pale blue dot we call home.",
    diameter: "12,742 km", diameterKm: 12742, distanceAU: 1.0, distanceKm: 149_600_000,
    day: "24 hours", year: "365.25 days", moons: "1", moonsCount: 1,
    surfaceTempC: "−88 to 58", gravity: "9.81 m/s²",
    funFact: "Earth is the only place in the universe we know of with life.",
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
    diameter: "6,779 km", diameterKm: 6779, distanceAU: 1.52, distanceKm: 227_900_000,
    day: "24h 37m", year: "687 Earth days", moons: "2", moonsCount: 2,
    surfaceTempC: "−143 to 35", gravity: "3.71 m/s²",
    funFact: "Mars has the tallest volcano in the Solar System — Olympus Mons.",
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
    diameter: "139,820 km", diameterKm: 139820, distanceAU: 5.20, distanceKm: 778_500_000,
    day: "9h 56m", year: "12 Earth years", moons: "95+", moonsCount: 95,
    surfaceTempC: "−145 (cloud top)", gravity: "24.79 m/s²",
    funFact: "Jupiter is so big you could fit 1,300 Earths inside it.",
    facts: ["The Great Red Spot is a storm bigger than Earth", "Has the strongest magnetic field of any planet", "Could fit 1,300 Earths inside it"],
    hotspots: [
      { id: "grs", lat: -22, lon: 20, title: "Great Red Spot", fact: "A hurricane bigger than Earth that has been spinning for 350+ years." },
      { id: "moons", lat: 10, lon: -120, title: "Galilean moons", fact: "Io, Europa, Ganymede and Callisto were spotted by Galileo in 1610." },
    ],
  },
  {
    key: "saturn", name: "Saturn", color: "#e6c98a", ring: true, ringColor: "#d6b272",
    tagline: "The jewel of the Solar System.",
    diameter: "116,460 km", diameterKm: 116460, distanceAU: 9.58, distanceKm: 1_434_000_000,
    day: "10h 42m", year: "29 Earth years", moons: "146+", moonsCount: 146,
    surfaceTempC: "−178 (cloud top)", gravity: "10.44 m/s²",
    funFact: "Saturn is so light it would float in a giant bathtub of water.",
    facts: ["Its rings are made of ice and rock", "It's so light, it would float on water", "Titan, its largest moon, has lakes of liquid methane"],
    hotspots: [
      { id: "hex", lat: 78, lon: 0, title: "Hexagon storm", fact: "A six-sided cloud pattern at the north pole — wider than two Earths." },
      { id: "rings", lat: 0, lon: 90, title: "The famous rings", fact: "Mostly ice chunks ranging from grains of sand to house-sized boulders." },
    ],
  },
  {
    key: "uranus", name: "Uranus", color: "#9fdfe8", ring: true, ringColor: "#7fbfd0",
    tagline: "The tilted ice giant rolling on its side.",
    diameter: "50,724 km", diameterKm: 50724, distanceAU: 19.18, distanceKm: 2_871_000_000,
    day: "17 hours", year: "84 Earth years", moons: "27", moonsCount: 27,
    surfaceTempC: "−224", gravity: "8.69 m/s²",
    funFact: "Uranus rolls along its orbit like a ball, tipped over by 98°.",
    facts: ["Rotates on its side at 98°", "Coldest planetary atmosphere at −224°C", "First planet discovered with a telescope"],
    hotspots: [
      { id: "tilt", lat: 80, lon: 30, title: "Sideways spin", fact: "Uranus is tipped so far over that it rolls along its orbit like a ball." },
      { id: "miranda", lat: -20, lon: -100, title: "Miranda's cliffs", fact: "Its moon Miranda has cliffs 20 km tall — the tallest in the Solar System." },
    ],
  },
  {
    key: "neptune", name: "Neptune", color: "#4868c8",
    tagline: "The windy blue world at the edge.",
    diameter: "49,244 km", diameterKm: 49244, distanceAU: 30.07, distanceKm: 4_495_000_000,
    day: "16 hours", year: "165 Earth years", moons: "14", moonsCount: 14,
    surfaceTempC: "−214", gravity: "11.15 m/s²",
    funFact: "Neptune has winds that scream at 2,100 km/h — faster than a jet.",
    facts: ["Winds blow at 2,100 km/h", "Discovered through mathematics before being seen", "Its moon Triton orbits backwards"],
    hotspots: [
      { id: "dark", lat: -20, lon: -30, title: "Great Dark Spot", fact: "A storm the size of Earth, first seen by Voyager 2 in 1989." },
      { id: "triton", lat: 30, lon: 110, title: "Triton", fact: "An icy moon that orbits backwards — it was probably captured from the Kuiper Belt." },
    ],
  },
];

export function getPlanet(key: string) {
  return PLANETS.find((p) => p.key === key);
}
