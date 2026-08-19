import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://beyonddisability.org";
  const routes = ["", "/about", "/programmes", "/partner", "/advocacy", "/associates", "/supporters", "/get-help", "/impact", "/volunteer", "/transparency", "/resources", "/donate"];
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/get-help" || route === "/donate" ? 0.9 : 0.7,
  }));
}
