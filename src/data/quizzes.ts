// Quiz challenges that pair with planet hotspots (by hotspot id).
// Two questions per hotspot keeps the popup snappy.

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;       // index into options
  reward: string;       // short congrats line
}

export const HOTSPOT_QUIZZES: Record<string, QuizQuestion[]> = {
  // Mercury
  "caloris": [{ q: "Caloris Basin was made by…", options: ["A huge meteor impact", "A volcano", "Aliens building cities"], answer: 0, reward: "Crater champ! 💥" }],
  "polar-ice": [{ q: "How can ice survive on hot Mercury?", options: ["In deep crater shadows", "Inside volcanoes", "Under the equator"], answer: 0, reward: "Frosty fact unlocked! ❄️" }],
  // Venus
  "maxwell": [{ q: "Is Maxwell Montes taller than Mount Everest?", options: ["Yes — way taller", "About the same", "No, much smaller"], answer: 0, reward: "Peak scholar! ⛰️" }],
  "clouds": [{ q: "Venus's clouds are made of…", options: ["Sulfuric acid", "Water", "Cotton candy"], answer: 0, reward: "Cloud detective! ☁️" }],
  // Earth
  "amazon": [{ q: "About how much of Earth's oxygen comes from the Amazon?", options: ["6%", "60%", "0.6%"], answer: 0, reward: "Oxygen ace! 🌳" }],
  "himalayas": [{ q: "How tall is Mount Everest?", options: ["8,848 m", "1,000 m", "20,000 m"], answer: 0, reward: "Mountain master! 🏔️" }],
  "pacific": [{ q: "Compared to all of Earth's land, the Pacific Ocean is…", options: ["Bigger than all the land combined", "About the same", "Smaller"], answer: 0, reward: "Ocean explorer! 🌊" }],
  // Mars
  "olympus": [{ q: "Olympus Mons is taller than Everest by about…", options: ["3 times", "Same height", "Half as tall"], answer: 0, reward: "Volcano vanquisher! 🌋" }],
  "valles": [{ q: "Valles Marineris is as long as…", options: ["The USA is wide", "A football field", "The Moon"], answer: 0, reward: "Canyon conqueror! 🪨" }],
  "south-pole": [{ q: "Mars's south polar cap is made mostly of…", options: ["Frozen carbon dioxide", "Salty water", "Pure gold"], answer: 0, reward: "Polar pro! 🧊" }],
  // Jupiter
  "grs": [{ q: "The Great Red Spot is a giant…", options: ["Storm", "Volcano", "Forest"], answer: 0, reward: "Storm sleuth! 🌀" }],
  "moons": [{ q: "Who first spotted the Galilean moons?", options: ["Galileo", "Newton", "Einstein"], answer: 0, reward: "Moon hunter! 🔭" }],
  // Saturn
  "hex": [{ q: "Saturn's polar storm has how many sides?", options: ["6", "4", "8"], answer: 0, reward: "Hex hero! 🔷" }],
  "rings": [{ q: "Saturn's rings are mostly made of…", options: ["Ice and rock", "Sand", "Plastic"], answer: 0, reward: "Ring guardian! 💍" }],
  // Uranus
  "tilt": [{ q: "Uranus is tipped over by about…", options: ["98°", "23°", "0°"], answer: 0, reward: "Tilt-master! 🎡" }],
  "miranda": [{ q: "Miranda has the Solar System's tallest…", options: ["Cliffs", "Trees", "Skyscrapers"], answer: 0, reward: "Cliff climber! 🧗" }],
  // Neptune
  "dark": [{ q: "Neptune's Great Dark Spot is about the size of…", options: ["Earth", "The Moon", "A city"], answer: 0, reward: "Storm spotter! 🌑" }],
  "triton": [{ q: "Triton is unusual because it orbits…", options: ["Backwards", "Twice a day", "Around Mars"], answer: 0, reward: "Moon expert! 🌙" }],
};
