import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MessageCircle, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { PHONE_DISPLAY, buildWhatsAppLink } from "@/lib/products";
import {
  getLandingPageBySlug,
  getLocationPages,
  getServicePages,
  type LandingPage as LandingPageData,
} from "@/lib/landing-pages";
import NotFound from "./NotFound";

const SITE_URL = "https://www.covering-guadeloupe.com";

const LandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = getLandingPageBySlug(slug || "");

  useEffect(() => {
    if (!page) return;

    const ensureMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let meta = document.head.querySelector(
        selector,
      ) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        if (isProperty) meta.setAttribute("property", name);
        else meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };
    const ensureCanonical = (href: string) => {
      let link = document.head.querySelector(
        'link[rel="canonical"]',
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    const url = `${SITE_URL}/${page.slug}`;
    document.title = page.metaTitle;
    ensureMeta("description", page.metaDescription);
    ensureMeta("keywords", page.keywords.join(", "));
    ensureMeta("og:title", page.metaTitle, true);
    ensureMeta("og:description", page.metaDescription, true);
    ensureMeta("og:type", "website", true);
    ensureMeta("og:url", url, true);
    ensureMeta("og:image", `${SITE_URL}/hero-john.png`, true);
    ensureMeta("twitter:title", page.metaTitle);
    ensureMeta("twitter:description", page.metaDescription);
    ensureMeta("twitter:image", `${SITE_URL}/hero-john.png`);
    ensureCanonical(url);

    const blocks: object[] = [];

    blocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: SITE_URL + "/",
        },
        { "@type": "ListItem", position: 2, name: page.title, item: url },
      ],
    });

    if (page.type === "location") {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": url + "#business",
        name: `Melmenuiserie 971 — Covering ${page.city}`,
        description: page.metaDescription,
        image: `${SITE_URL}/hero-john.png`,
        url,
        telephone: "+590690500381",
        priceRange: "€€",
        areaServed: { "@type": "City", name: page.city },
        address: {
          "@type": "PostalAddress",
          addressLocality: page.city,
          postalCode: page.postalArea,
          addressRegion: "Guadeloupe",
          addressCountry: "FR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 16.265,
          longitude: -61.551,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "08:00",
            closes: "18:00",
          },
        ],
        sameAs: ["https://www.instagram.com/melmenuiserie971"],
      });
    } else {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "Service",
        name: page.title,
        description: page.metaDescription,
        areaServed: { "@type": "Place", name: "Guadeloupe" },
        provider: {
          "@type": "LocalBusiness",
          name: "Melmenuiserie 971",
          telephone: "+590690500381",
          url: SITE_URL,
        },
      });
    }

    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });

    let script = document.getElementById(
      "landing-jsonld",
    ) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "landing-jsonld";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(blocks);

    document.dispatchEvent(new Event("prerender-ready"));

    return () => {
      document.getElementById("landing-jsonld")?.remove();
    };
  }, [page]);

  if (!page) return <NotFound />;

  const whatsappMsg =
    page.type === "location"
      ? `Bonjour John, je souhaite un devis pour un covering à ${page.city}.`
      : `Bonjour John, je vous contacte au sujet de : ${page.title}.`;

  const otherLocations = getLocationPages().filter((p) => p.slug !== page.slug);
  const otherServices = getServicePages().filter((p) => p.slug !== page.slug);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bg-gradient-warm">
          <div className="container-tight py-16 lg:py-24">
            <nav className="text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary">
                Accueil
              </Link>
              <span className="mx-2">/</span>
              <span>{page.title}</span>
            </nav>
            {page.type === "location" && (
              <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                <MapPin className="w-3.5 h-3.5" />
                {page.city} · {page.postalArea}
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 max-w-4xl">
              {page.h1}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              {page.intro}
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button size="lg" asChild>
                <a href={buildWhatsAppLink(whatsappMsg)}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Devis gratuit WhatsApp
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={`tel:${PHONE_DISPLAY.replace(/\s/g, "")}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  {PHONE_DISPLAY}
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="container-tight grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              {page.sections.map((s) => (
                <article key={s.heading}>
                  <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
                    {s.heading}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {s.body}
                  </p>
                </article>
              ))}
            </div>
            <aside className="space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border/60">
                <h3 className="font-semibold mb-4">Pourquoi Melmenuiserie 971</h3>
                <ul className="space-y-3 text-sm">
                  {[
                    "Artisan menuisier · 35+ ans d'expérience",
                    "Vendeur agréé Cover Styl' en Guadeloupe",
                    "500+ références de vinyle en stock",
                    "Devis gratuit sous 24h",
                    "Intervention rapide, partout sur l'île",
                  ].map((x) => (
                    <li key={x} className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-warm rounded-2xl p-6">
                <h3 className="font-semibold mb-2">Obtenez votre devis</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Envoyez-nous quelques photos, nous vous répondons sous 24h.
                </p>
                <Button className="w-full" asChild>
                  <a href={buildWhatsAppLink(whatsappMsg)}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </aside>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-card/40 border-y border-border/60">
          <div className="container-tight max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-semibold mb-10">
              Questions fréquentes
            </h2>
            <div className="space-y-6">
              {page.faq.map((f) => (
                <div
                  key={f.q}
                  className="bg-background rounded-2xl p-6 border border-border/60"
                >
                  <h3 className="font-semibold mb-2">{f.q}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-tight">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
              {page.type === "location"
                ? "Covering dans d'autres communes"
                : "Explorer nos communes d'intervention"}
            </h2>
            <div className="flex flex-wrap gap-2 mb-10">
              {(page.type === "location"
                ? otherLocations
                : getLocationPages()
              ).map((p) => (
                <Link
                  key={p.slug}
                  to={`/${p.slug}`}
                  className="px-4 py-2 rounded-full border border-border hover:border-primary hover:text-primary text-sm transition-colors"
                >
                  {p.city}
                </Link>
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
              Guides & services
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(page.type !== "location"
                ? otherServices
                : getServicePages()
              ).map((p) => (
                <Link
                  key={p.slug}
                  to={`/${p.slug}`}
                  className="block p-5 rounded-2xl border border-border hover:border-primary bg-card transition-colors"
                >
                  <div className="font-semibold mb-1">{p.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {p.metaDescription}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
