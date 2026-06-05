import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SpaceNav } from "../components/SpaceNav";
import { SpaceFooter } from "../components/SpaceFooter";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-aurora glow-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Lost in space</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This corner of the universe doesn't exist yet. Let's get you back to base.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-105"
          >
            Return to mission control
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center glass rounded-2xl p-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Mission anomaly detected
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Try again
          </button>
          <a href="/" className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-foreground hover:bg-white/5">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0a0820" },
      { title: "Cosmoverse — A Cinematic Space Adventure for Young Explorers" },
      { name: "description", content: "Travel through the Solar System, Milky Way, black holes, stars and ISRO missions in an immersive 3D learning experience for kids." },
      { property: "og:title", content: "Cosmoverse — Explore the Universe in 3D" },
      { property: "og:description", content: "A cinematic 3D journey through planets, galaxies, black holes and space missions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SpaceNav />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <SpaceFooter />
    </QueryClientProvider>
  );
}
