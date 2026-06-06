import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Rocket } from "lucide-react";
import { JourneyLauncher } from "./JourneyMode";

const links = [
  { to: "/", label: "Home" },
  { to: "/planets", label: "Planets" },
  { to: "/compare", label: "Compare" },
  { to: "/galaxy", label: "Galaxy" },
  { to: "/black-holes", label: "Black Holes" },
  { to: "/stars", label: "Stars" },
  { to: "/isro", label: "ISRO" },
  { to: "/ai-lab", label: "AI Lab" },
] as const;

export function SpaceNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
        <nav className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-nebula shadow-glow">
              <Rocket className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="font-semibold tracking-tight text-aurora text-lg">Cosmoverse</span>
          </Link>
          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  activeOptions={{ exact: l.to === "/" }}
                  activeProps={{ className: "text-foreground bg-white/5" }}
                  inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="hidden md:flex items-center gap-2">
            <JourneyLauncher />
          </div>
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
        {open && (
          <div className="md:hidden glass rounded-2xl mt-2 p-2 animate-fade-in">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "bg-white/5 text-foreground" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="block px-4 py-3 rounded-xl text-sm font-medium"
              >
                {l.label}
              </Link>
            ))}
            <div className="px-2 pt-2"><JourneyLauncher className="w-full justify-center" /></div>
          </div>
        )}
      </div>
    </header>
  );
}
