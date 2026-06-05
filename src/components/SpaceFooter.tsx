import { Link } from "@tanstack/react-router";

export function SpaceFooter() {
  return (
    <footer className="relative mt-32 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="text-aurora text-xl font-semibold">Cosmoverse</div>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            A cinematic journey through the universe — built to spark curiosity in the next generation of explorers.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground mb-3">Explore</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/planets" className="hover:text-foreground">Planets</Link></li>
            <li><Link to="/galaxy" className="hover:text-foreground">Milky Way</Link></li>
            <li><Link to="/black-holes" className="hover:text-foreground">Black Holes</Link></li>
            <li><Link to="/stars" className="hover:text-foreground">Stars & Nebulae</Link></li>
            <li><Link to="/isro" className="hover:text-foreground">ISRO Missions</Link></li>
          </ul>
        </div>
        <div className="text-sm text-muted-foreground">
          <div className="text-foreground font-semibold mb-3">Did you know?</div>
          <p>Light from the Sun takes about <span className="text-aurora font-semibold">8 minutes 20 seconds</span> to reach Earth.</p>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Cosmoverse · Made for young explorers 🚀
      </div>
    </footer>
  );
}
