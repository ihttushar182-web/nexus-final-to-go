import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private surfaces must never be indexed (Build Spec §31 / QA FUN-04).
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          // Result pages are personal output; /search is a tool, not content.
          "/business-audit/result/",
          "/search",
          "/login",
          "/dashboard",
          "/account",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
