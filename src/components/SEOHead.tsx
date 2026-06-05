import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function SEOHead({ title, description, image, url }: SEOHeadProps) {
  const fullTitle = title ? `${title} | Kepul` : "Kepul — Solusi Pengelolaan Sampah Modern";
  const desc = description || "Kepul adalah platform pengelolaan sampah modern untuk rumah tangga, bisnis, sekolah, dan komunitas.";

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", desc);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", desc, "property");
    setMeta("og:type", "website", "property");
    if (image) setMeta("og:image", image, "property");
    if (url) setMeta("og:url", url, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    if (image) setMeta("twitter:image", image);
  }, [fullTitle, desc, image, url]);

  return null;
}
