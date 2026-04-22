import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Star, Eye } from "lucide-react";
import samples from "@/assets/covering-samples.jpg";
import { Link } from "react-router-dom";
import { PayPalButton } from "@/components/site/PayPalButton";

export const Shop = () => (
  <section id="boutique" className="py-20 lg:py-28 bg-gradient-warm">
    <div className="container-tight">
      <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end mb-12">
        <div className="max-w-2xl">
          <span className="badge-local mb-4">Boutique</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
            Achetez votre vinyle <em className="font-script text-primary not-italic">au mètre linéaire</em>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Vinyles Cover Styl' premium, vendus au mètre linéaire (largeur 1.20m). Posez vous-même ou confiez-moi
            la pose. Commande simple par WhatsApp.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            <strong>Plus de 500 références disponibles !</strong> Les galeries ci-dessous ne montrent qu'une sélection. Contactez-moi pour des précisions visuelles, consulter d'autres références ou obtenir des échantillons physiques.
          </p>
        </div>
        <img src={samples} alt="Échantillons de vinyle covering" loading="lazy" width={400} height={400}
          className="hidden lg:block w-48 h-48 object-cover rounded-2xl shadow-card" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map(p => (
          <article key={p.id} className="group bg-card rounded-2xl overflow-hidden border border-border/60 hover:shadow-elegant transition-all hover:-translate-y-1 flex flex-col">
            <div className="relative aspect-square overflow-hidden">
              <img src={p.image} alt={p.name} loading="lazy" width={512} height={512}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              {p.highlight && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-current" /> Premium
                </span>
              )}
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-semibold text-base leading-tight">{p.name}</h3>
              <p className="text-sm text-muted-foreground mt-2 flex-1 leading-relaxed line-clamp-3">{p.description}</p>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-2xl font-semibold text-primary">{p.price}€</span>
                <span className="text-xs text-muted-foreground">{p.unit}</span>
              </div>
              <div className="mt-3 space-y-2">
                <PayPalButton
                  productId={p.id}
                  productName={p.name}
                  amount={p.price}
                  description={`${p.name}${p.unit ?? ""}`}
                  paypalOnly
                />
                <Button asChild size="lg" variant="outline" className="w-full">
                  <Link to={`/produit/${p.id}`}>
                    <Eye className="w-4 h-4 mr-2" /> Voir le produit
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-8">
        <strong>Plusieurs références disponibles</strong> dans chaque gamme. Contactez-moi pour explorer toutes les options ou recevoir des échantillons.<br />
        <span className="text-xs">WhatsApp : <a href="tel:0690500381" className="hover:text-primary">0690 50 03 81</a></span>
      </p>
    </div>
  </section>
);
