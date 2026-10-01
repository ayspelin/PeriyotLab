import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { getHiddenProductIds } from "@/lib/productVisibility";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

function sitemapEntry(
  path: string,
  options: {
    lastModified?: Date;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
  } = {}
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified: options.lastModified ?? new Date(),
    changeFrequency: options.changeFrequency,
    priority: options.priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    sitemapEntry("/", { changeFrequency: "weekly", priority: 1 }),
    sitemapEntry("/about", { changeFrequency: "monthly", priority: 0.7 }),
    sitemapEntry("/products", { changeFrequency: "weekly", priority: 0.8 }),
    sitemapEntry("/bakim-onarim", { changeFrequency: "monthly", priority: 0.8 }),
    sitemapEntry("/ozel-imalat", { changeFrequency: "weekly", priority: 0.8 }),
    sitemapEntry("/contact", { changeFrequency: "monthly", priority: 0.7 }),
    sitemapEntry("/servis-takip", { changeFrequency: "monthly", priority: 0.5 }),
  ];

  try {
    const hiddenProductIds = await getHiddenProductIds();
    const [products, customManufacturingItems] = await Promise.all([
      prisma.product.findMany({
        where: hiddenProductIds.length > 0 ? { id: { notIn: hiddenProductIds } } : undefined,
        select: {
          id: true,
          updatedAt: true,
        },
      }),
      prisma.customManufacturingItem.findMany({
        where: {
          published: true,
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
    ]);

    return [
      ...staticRoutes,
      ...products.map((product) =>
        sitemapEntry(`/products/${product.id}`, {
          lastModified: product.updatedAt,
          changeFrequency: "monthly",
          priority: 0.6,
        })
      ),
      ...customManufacturingItems.map((item) =>
        sitemapEntry(`/ozel-imalat/${item.slug}`, {
          lastModified: item.updatedAt,
          changeFrequency: "monthly",
          priority: 0.7,
        })
      ),
    ];
  } catch {
    return staticRoutes;
  }
}
