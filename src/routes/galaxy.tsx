import { createFileRoute } from "@tanstack/react-router";
import { ClientCanvas } from "@/components/three/ClientCanvas";
import { StarField } from "@/components/three/StarField";
import { SpiralGalaxy } from "@/components/three/SpiralGalaxy";

export const Route = createFileRoute("/galaxy")({
  head: () => ({
    meta: [
      { title: "The Milky Way — Cosmoverse" },
      { name: "description", content: "Fly through our spiral home galaxy. Learn about the Milky Way, Andromeda, and how galaxies form and collide." },
      { property: "og:title", content: "The Milky Way — Cosmoverse" },
      { property: "og:description", content: "An interactive 3D journey through galaxies and the cosmic web." },
    ],
  }),
  component: GalaxyPage,
});

const GALAXIES = [
  { name: "Milky Way", type: "Barred Spiral", size: "100,000 ly", stars: "100–400 billion", note: "Our home — the Sun is one of its outer-arm stars." },
  { name: "Andromeda", type: "Spiral", size: "220,000 ly", stars: "~1 trillion", note: "On a 4.5-billion-year collision course with us." },
  { name: "Triangulum", type: "Spiral", size: "60,000 ly", stars: "~40 billion", note: "The third-largest in our Local Group." },
  { name: "Sombrero", type: "Lenticular", size: "50,000 ly", stars: "~100 billion", note: "Famous for its bright nucleus and dust lane." },
];

function GalaxyPage() {
  return (
    <div className="relative pt-32 pb-20">
      <section className="relative mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Chapter 02</p>
            <h1 className="mt-3 text-5xl md:text-6xl font-bold">The Milky Way<br /><span className="text-aurora">Galaxy</span></h1>
            <p className="mt-5 text-lg text-muted-foreground">
              A barred spiral of <strong className="text-foreground">200 billion stars</strong>, spinning at 828,000 km/h. Our Sun takes 230 million years to make one lap around its supermassive black hole, Sagittarius A*.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                ["Diameter", "100,000 light-years"],
                ["Age", "13.6 billion years"],
                ["Spiral arms", "4 major"],
                ["Sun's distance from center", "26,000 ly"],
              ].map(([k, v]) => (
                <div key={k} className="glass rounded-2xl p-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
                  <div className="mt-1 text-base font-semibold">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-square w-full glass rounded-3xl overflow-hidden">
            <ClientCanvas camera={{ position: [0, 4, 9], fov: 55 }} dpr={[1, 1.8]}>
              <color attach="background" args={["#04020c"]} />
              <ambientLight intensity={0.2} />
              <StarField count={2500} radius={60} />
              <SpiralGalaxy />
              {/* central glow */}
              <mesh>
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshBasicMaterial color="#fff3c4" />
              </mesh>
              <pointLight position={[0, 0, 0]} color="#ffd27a" intensity={1.5} distance={10} />
            </ClientCanvas>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 mt-24">
        <h2 className="text-3xl md:text-4xl font-bold">Our cosmic neighbours</h2>
        <p className="mt-2 text-muted-foreground max-w-xl">There are more than 100 billion galaxies in the observable universe. Here are a few of the closest.</p>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {GALAXIES.map((g) => (
            <div key={g.name} className="glass rounded-2xl p-5">
              <div className="text-xs uppercase tracking-wider text-primary">{g.type}</div>
              <div className="mt-2 text-xl font-semibold">{g.name}</div>
              <dl className="mt-3 space-y-1 text-sm text-muted-foreground">
                <div>Size: <span className="text-foreground">{g.size}</span></div>
                <div>Stars: <span className="text-foreground">{g.stars}</span></div>
              </dl>
              <p className="mt-3 text-sm text-muted-foreground">{g.note}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
