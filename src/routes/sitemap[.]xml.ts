import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { MISSIONS } from "@/data/missions";

const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/planets", changefreq: "monthly", priority: "0.9" },
          { path: "/galaxy", changefreq: "monthly", priority: "0.9" },
          { path: "/black-holes", changefreq: "monthly", priority: "0.9" },
          { path: "/stars", changefreq: "monthly", priority: "0.9" },
          { path: "/isro", changefreq: "monthly", priority: "0.9" },
          { path: "/compare", changefreq: "monthly", priority: "0.8" },
          { path: "/ai-lab", changefreq: "monthly", priority: "0.8" },
          ...MISSIONS.map((m) => ({ path: `/isro/${m.slug}`, changefreq: "monthly" as const, priority: "0.8" })),
        ];
        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
