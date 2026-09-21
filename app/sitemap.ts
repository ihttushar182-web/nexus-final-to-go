import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { products } from "@/data/products";
import { solutionCategories } from "@/data/solutions";
import { insights } from "@/data/insights";
import { caseStudies } from "@/data/case-studies";
import { policies } from "@/data/policies";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/capabilities", priority: 0.9, changeFrequency: "monthly" },
    { path: "/solutions", priority: 0.9, changeFrequency: "monthly" },
    { path: "/products", priority: 0.9, changeFrequency: "weekly" },
    { path: "/business-audit", priority: 0.95, changeFrequency: "monthly" },
    { path: "/framework", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "yearly" },
    { path: "/nexus-host", priority: 0.8, changeFrequency: "monthly" },
    { path: "/case-studies", priority: 0.7, changeFrequency: "monthly" },
    { path: "/insights", priority: 0.75, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/book-call", priority: 0.8, changeFrequency: "monthly" },
    { path: "/resources/sme-maturity-report", priority: 0.6, changeFrequency: "monthly" },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...products.map((product) => ({
      url: `${base}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...solutionCategories.map((category) => ({
      url: `${base}/solutions/${category.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...insights.map((article) => ({
      url: `${base}/insights/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...caseStudies.map((study) => ({
      url: `${base}/case-studies#${study.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...policies.map((policy) => ({
      url: `${base}/${policy.slug}`,
      lastModified: new Date(policy.updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
