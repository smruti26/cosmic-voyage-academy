import type { CraftType } from "@/components/three/Spacecraft3D";

export interface MissionTimelineItem {
  date: string;
  event: string;
}

export interface Mission {
  slug: string;
  year: string;
  name: string;
  tagline: string;
  category: "Moon" | "Mars" | "Sun" | "Earth orbit" | "Human spaceflight";
  craft: CraftType;
  accent: string;
  hero: string;
  facts: { k: string; v: string }[];
  story: string[];
  timeline: MissionTimelineItem[];
  checklist: string[];
}

export const MISSIONS: Mission[] = [
  {
    slug: "chandrayaan-1",
    year: "2008",
    name: "Chandrayaan-1",
    tagline: "India's first Moon mission discovered water on the lunar surface.",
    category: "Moon",
    craft: "orbiter",
    accent: "#9fdfe8",
    hero: "On 22 October 2008 a PSLV-XL lifted off from Sriharikota carrying India's first spacecraft to another world.",
    facts: [
      { k: "Launch", v: "22 Oct 2008" },
      { k: "Rocket", v: "PSLV-XL" },
      { k: "Mission length", v: "312 days" },
      { k: "Orbit", v: "100 km lunar polar" },
    ],
    story: [
      "Chandrayaan-1 carried 11 scientific instruments from India, the US, Europe and Bulgaria.",
      "Its Moon Impact Probe slammed into the lunar south pole, confirming the presence of water molecules.",
      "The orbiter mapped the Moon's surface in unprecedented detail before contact was lost in August 2009.",
    ],
    timeline: [
      { date: "22 Oct 2008", event: "Launch from Sriharikota" },
      { date: "08 Nov 2008", event: "Inserted into lunar orbit" },
      { date: "14 Nov 2008", event: "Moon Impact Probe lands" },
      { date: "25 Sep 2009", event: "NASA confirms water on Moon" },
      { date: "28 Aug 2009", event: "Mission ends" },
    ],
    checklist: [
      "Strap into the PSLV rocket",
      "Reach Earth orbit",
      "Fire boosters toward the Moon",
      "Slow down and enter lunar orbit",
      "Release the Moon Impact Probe",
      "Scan the Moon for 312 days",
    ],
  },
  {
    slug: "mangalyaan",
    year: "2013",
    name: "Mangalyaan (Mars Orbiter Mission)",
    tagline: "India became the first nation to reach Mars on its very first try.",
    category: "Mars",
    craft: "orbiter",
    accent: "#d2532f",
    hero: "Built in just 15 months on a shoestring budget, Mangalyaan made India the first Asian nation — and the first country ever — to orbit Mars on a debut attempt.",
    facts: [
      { k: "Launch", v: "5 Nov 2013" },
      { k: "Arrival", v: "24 Sep 2014" },
      { k: "Cost", v: "≈ ₹450 crore" },
      { k: "Distance traveled", v: "780 million km" },
    ],
    story: [
      "MOM cruised through deep space for 10 months before slipping into Martian orbit.",
      "It carried 5 science payloads to study Mars' surface, atmosphere and mineralogy.",
      "The mission was so frugal it cost less to fly to Mars than to make a Hollywood space movie.",
    ],
    timeline: [
      { date: "05 Nov 2013", event: "Launch on PSLV-C25" },
      { date: "01 Dec 2013", event: "Trans-Mars injection" },
      { date: "24 Sep 2014", event: "Mars orbit insertion" },
      { date: "Sep 2014–2022", event: "8 years of science data" },
      { date: "Oct 2022", event: "Mission concluded" },
    ],
    checklist: [
      "Pack 5 science instruments",
      "Launch on PSLV-C25",
      "Slingshot around Earth 6 times",
      "Coast 10 months to Mars",
      "Fire engine to enter orbit",
      "Beam Mars photos home",
    ],
  },
  {
    slug: "chandrayaan-3",
    year: "2023",
    name: "Chandrayaan-3",
    tagline: "The Vikram lander touched down near the Moon's south pole — a world first.",
    category: "Moon",
    craft: "lander",
    accent: "#ffd27a",
    hero: "On 23 August 2023, Vikram became the first lander ever to softly touch down in the lunar south polar region — making India the fourth country to land on the Moon.",
    facts: [
      { k: "Launch", v: "14 Jul 2023" },
      { k: "Landing", v: "23 Aug 2023" },
      { k: "Rocket", v: "LVM3-M4" },
      { k: "Rover", v: "Pragyan (26 kg)" },
    ],
    story: [
      "After Chandrayaan-2 narrowly missed a soft landing, ISRO rebuilt the lander with stronger legs, more fuel and smarter software.",
      "Pragyan rover rolled out hours after landing and explored 100+ meters of lunar soil.",
      "Instruments confirmed sulphur, aluminium and iron near the south pole — vital for future Moon bases.",
    ],
    timeline: [
      { date: "14 Jul 2023", event: "Launch from Sriharikota" },
      { date: "05 Aug 2023", event: "Lunar orbit insertion" },
      { date: "17 Aug 2023", event: "Lander module separates" },
      { date: "23 Aug 2023", event: "Vikram soft-lands ✨" },
      { date: "24 Aug 2023", event: "Pragyan rover deploys" },
    ],
    checklist: [
      "Launch on India's heaviest rocket, LVM3",
      "Spiral out to the Moon over 3 weeks",
      "Separate the lander from the propulsion module",
      "Slow from 6,000 km/h to a hover",
      "Touch down on 4 sturdy legs",
      "Roll out Pragyan rover",
      "Send data back to Earth",
    ],
  },
  {
    slug: "aditya-l1",
    year: "2023",
    name: "Aditya-L1",
    tagline: "India's first observatory dedicated to studying the Sun.",
    category: "Sun",
    craft: "probe",
    accent: "#ff9a3c",
    hero: "Aditya-L1 lives at Lagrange Point 1 — a sweet spot 1.5 million km from Earth where it can watch the Sun without interruption.",
    facts: [
      { k: "Launch", v: "2 Sep 2023" },
      { k: "Arrival at L1", v: "6 Jan 2024" },
      { k: "Distance", v: "1.5 million km" },
      { k: "Payloads", v: "7 instruments" },
    ],
    story: [
      "From its halo orbit around L1, Aditya watches solar flares, coronal mass ejections and the solar wind in real time.",
      "Its data helps protect Earth's satellites and power grids from space weather.",
      "It's the first dedicated Indian mission to study our nearest star.",
    ],
    timeline: [
      { date: "02 Sep 2023", event: "Launch on PSLV-C57" },
      { date: "19 Sep 2023", event: "Leaves Earth orbit" },
      { date: "06 Jan 2024", event: "Reaches L1 halo orbit" },
      { date: "2024+", event: "Continuous solar observation" },
    ],
    checklist: [
      "Pack 7 sun-watching instruments",
      "Launch on PSLV-C57",
      "Spiral out from Earth orbit",
      "Cruise 4 months to L1",
      "Enter a halo orbit around L1",
      "Stream solar data 24/7",
    ],
  },
  {
    slug: "gaganyaan",
    year: "2025+",
    name: "Gaganyaan",
    tagline: "India's first human spaceflight programme.",
    category: "Human spaceflight",
    craft: "rocket",
    accent: "#5cd0ff",
    hero: "Gaganyaan will carry up to three Indian astronauts — Vyomanauts — to a 400 km low Earth orbit for a 3-day mission.",
    facts: [
      { k: "Crew", v: "Up to 3 Vyomanauts" },
      { k: "Rocket", v: "Human-rated LVM3" },
      { k: "Orbit", v: "400 km LEO" },
      { k: "Duration", v: "3 days" },
    ],
    story: [
      "Four Indian Air Force pilots have been selected and trained in Russia and India.",
      "Uncrewed test flights and a crew escape demonstration are being flown to prove every system works perfectly.",
      "Success will make India the fourth country to put humans in space using its own rocket.",
    ],
    timeline: [
      { date: "2018", event: "Programme announced" },
      { date: "2024", event: "Vyomanauts introduced" },
      { date: "2024–25", event: "Uncrewed test flights" },
      { date: "2026", event: "First crewed flight (planned)" },
    ],
    checklist: [
      "Train as an astronaut for 18 months",
      "Fit-check spacesuit and capsule",
      "Strap into the LVM3 rocket",
      "Reach low Earth orbit in 16 minutes",
      "Float in microgravity for 3 days",
      "Splash down in the Arabian Sea",
    ],
  },
];

export function getMission(slug: string) {
  return MISSIONS.find((m) => m.slug === slug);
}
