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
        disallow: ["/admin", "/admin/", "/api/", "/business-audit/result/", "/login", "/dashboard", "/account"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
