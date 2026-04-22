import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductById, buildWhatsAppLink } from "@/lib/products";
import { PayPalButton } from "@/components/site/PayPalButton";

const SITE_URL = "https://www.covering-guadeloupe.com";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductById(id || "");
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-4">Produit non trouvé</h1>
          <Button onClick={() => navigate("/#boutique")}>
            Retour à la boutique
          </Button>
        </div>
      </div>
    );
  }

  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  useEffect(() => {
    const ensureMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let meta = document.head.querySelector(
        selector,
      ) as HTMLMetaElement | null;
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

    document.title = `${product.name} | Melmenuiserie 971`;
    const description = `${product.name} à ${product.price}€${product.unit}. Plus de 500 références disponibles. Contactez-nous sur WhatsApp pour plus de visuels.`;
    const pagePath = `/produit/${product.id}`;
    const pageUrl = `${SITE_URL}${pagePath}`;
    const primaryImage = allImages[0].startsWith("http")
      ? allImages[0]
      : `${SITE_URL}${allImages[0]}`;
    ensureMeta("description", description);
    ensureMeta("og:title", `${product.name} | Melmenuiserie 971`, true);
    ensureMeta("og:description", description, true);
    ensureMeta("og:type", "product", true);
    ensureMeta("og:url", pageUrl, true);
    ensureMeta("og:image", primaryImage, true);
    ensureMeta("twitter:title", `${product.name} | Melmenuiserie 971`);
    ensureMeta("twitter:description", description);
    ensureMeta("twitter:image", primaryImage);
    ensureCanonical(pageUrl);

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.detailedDescription || product.description,
      image: allImages.map((img) =>
        img.startsWith("http") ? img : `${SITE_URL}${img}`,
      ),
      brand: {
        "@type": "Brand",
        name: "Cover Styl'",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: product.price.toFixed(2),
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    };

    let script = document.getElementById(
      "product-jsonld",
    ) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "product-jsonld";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    document.dispatchEvent(new Event("prerender-ready"));

    return () => {
      const current = document.getElementById("product-jsonld");
      if (current) {
        current.remove();
      }
    };
  }, [allImages, product]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="container-tight h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/#boutique")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm text-muted-foreground">Boutique</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="container-tight py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-card shadow-card">
              <img
                src={allImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      idx === selectedImage
                        ? "border-primary shadow-card"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground text-center">
              + 500 références disponibles
            </p>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              {product.highlight && (
                <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  Premium
                </span>
              )}
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold mb-4">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    {product.price}€
                  </span>
                  <span className="text-lg text-muted-foreground">
                    {product.unit}
                  </span>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border/60">
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.detailedDescription || product.description}
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  Nous avons d'autres références dans cette catégorie. Pour plus
                  de visuels et de précisions, contactez-nous sur{" "}
                  <a
                    href={buildWhatsAppLink(
                      `Bonjour John, je souhaite voir plus de références dans la catégorie : ${product.name}. Pouvez-vous m'envoyer des visuels supplémentaires ?`,
                    )}
                    className="text-primary font-medium hover:underline"
                  >
                    WhatsApp
                  </a>
                  .
                </p>
              </div>

              <div className="bg-gradient-warm rounded-2xl p-6">
                <h3 className="font-semibold mb-2">Caractéristiques</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Vinyle premium Cover Styl'
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Résistant et durable
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Pose rapide et propre
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Vendeur agréé Guadeloupe
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />+
                    500 références disponibles
                  </li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mt-8">
              <PayPalButton
                productId={product.id}
                productName={product.name}
                amount={product.price}
                description={`${product.name}${product.unit ?? ""}`}
              />
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full"
              >
                <a
                  href={buildWhatsAppLink(
                    `Bonjour John, je souhaite commander : ${product.name} (${product.price}€${product.unit}). Pouvez-vous me confirmer la disponibilité et le délai ?`,
                  )}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Commander via WhatsApp
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: product.description,
                      url: window.location.href,
                    });
                  }
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
