import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-john.png";
import { buildWhatsAppLink } from "@/lib/products";

export const Hero = () => (
  <section id="top" className="relative overflow-hidden bg-gradient-warm">
    <div className="container-tight grid lg:grid-cols-2 gap-12 lg:gap-16 py-16 lg:py-24 items-center">
      <div className="space-y-7 animate-fade-up">
        <span className="badge-local">
          <Sparkles className="w-3.5 h-3.5" /> Nouveau en Guadeloupe
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-foreground">
          Transformez vos meubles
          <span className="block font-script text-primary text-5xl sm:text-6xl lg:text-7xl mt-2">
            sans tout casser.
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
          Spécialiste du{" "}
          <strong className="text-foreground">covering Cover Styl'</strong> en
          Guadeloupe. Donnez une seconde vie à votre cuisine, salle de bain ou
          commerce — rapide, propre, économique.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            asChild
            className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-elegant"
          >
            <a
              href={buildWhatsAppLink(
                "Bonjour John, je souhaite un devis pour un projet de covering.",
              )}
            >
              Demander un devis <ArrowRight className="ml-1 w-4 h-4" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-primary/30 text-primary hover:bg-primary/5"
          >
            <a href="#boutique">Voir la boutique</a>
          </Button>
        </div>
        <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
          <div>
            <strong className="text-foreground text-xl block">35+</strong>années
            d'expérience
          </div>
          <div className="w-px h-10 bg-border" />
          <div>
            <strong className="text-foreground text-xl block">100%</strong>
            artisanat local 🇬🇵
          </div>
          <div className="w-px h-10 bg-border" />
          <div>
            <strong className="text-foreground text-xl block">
              Cover Styl'
            </strong>
            vendeur agréé
          </div>
        </div>
      </div>
      <div
        className="relative animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="absolute -inset-4 bg-gradient-hero rounded-3xl opacity-10 blur-2xl" />
        <img
          src={heroImg}
          alt="John, expert artisan en covering en Guadeloupe"
          width={600}
          height={600}
          className="relative rounded-full shadow-elegant w-full max-w-md mx-auto lg:mx-0 object-contain"
        />
        <div className="absolute -bottom-5 -left-5 bg-card rounded-2xl shadow-card p-4 flex items-center gap-3 max-w-xs animate-float">
          <div className="w-10 h-10 rounded-full bg-accent grid place-items-center text-accent-foreground text-lg">
            ✓
          </div>
          <div className="text-sm">
            <div className="font-semibold">Rénovation en 4 à 5 jours</div>
            <div className="text-muted-foreground text-xs">
              Sans poussière, sans gros travaux
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
