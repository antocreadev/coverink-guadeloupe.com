import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Features } from "@/components/site/Features";
import { Applications } from "@/components/site/Applications";
import { Gallery } from "@/components/site/Gallery";
import { Shop } from "@/components/site/Shop";
import { About } from "@/components/site/About";
import { ContactCTA } from "@/components/site/ContactCTA";
import { Footer } from "@/components/site/Footer";
import { useEffect } from "react";

const SITE_URL = "https://www.covering-guadeloupe.com";

const Index = () => {
  useEffect(() => {
    const ensureMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        if (isProperty) {
          meta.setAttribute("property", name);
        } else {
          meta.setAttribute("name", name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    const ensureCanonical = (href: string) => {
      let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    document.title = "Melmenuiserie 971 — Covering Cover Styl' en Guadeloupe";
    ensureMeta(
      "description",
      "John, artisan menuisier en Guadeloupe, expert covering Cover Styl'. Rénovez vos meubles sans gros travaux. Plus de 500 références de vinyle au mètre linéaire. Devis gratuit."
    );
    ensureMeta("og:title", "Melmenuiserie 971 — Covering Cover Styl' Guadeloupe", true);
    ensureMeta("og:description", "Transformez vos meubles sans gros travaux. Plus de 500 références disponibles en Guadeloupe.", true);
    ensureMeta("og:type", "website", true);
    ensureMeta("og:url", `${SITE_URL}/`, true);
    ensureMeta("og:image", `${SITE_URL}/hero-john.png`, true);
    ensureMeta("twitter:title", "Melmenuiserie 971 — Covering Cover Styl' Guadeloupe");
    ensureMeta("twitter:description", "Transformez vos meubles sans gros travaux. Plus de 500 références disponibles en Guadeloupe.");
    ensureMeta("twitter:image", `${SITE_URL}/hero-john.png`);
    ensureCanonical(`${SITE_URL}/`);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Applications />
        <Gallery />
        <Shop />
        <About />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
