import { products, buildWhatsAppLink } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star, Eye } from "lucide-react";
import samples from "@/assets/covering-samples.jpg";
import { Link } from "react-router-dom";

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
              <div className="flex gap-2 mt-3">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link to={`/produit/${p.id}`}>
                    <Eye className="w-3.5 h-3.5 mr-1" /> Voir
                  </Link>
                </Button>
                <Button asChild size="sm" className="flex-1 bg-primary hover:bg-primary-glow text-primary-foreground">
                  <a href={buildWhatsAppLink(`Bonjour John, je souhaite commander : ${p.name} (${p.price}€${p.unit}). Pouvez-vous me confirmer la disponibilité ?`)}>
                    <MessageCircle className="w-3.5 h-3.5 mr-1" /> Commander
                  </a>
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
