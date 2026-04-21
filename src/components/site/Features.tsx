import { Clock, Sparkles, Leaf, Wallet, ShieldCheck, Wrench } from "lucide-react";

const items = [
  { icon: Clock, title: "Pose rapide & propre", desc: "Quelques heures à 4 - 5 jours selon le projet. Aucune poussière." },
  { icon: Wallet, title: "Jusqu'à 70% moins cher", desc: "Comparé à un remplacement complet de cuisine ou mobilier." },
  { icon: Sparkles, title: "Rendu bluffant", desc: "Effet bois, marbre, béton, cuir, métal — réalisme exceptionnel." },
  { icon: Leaf, title: "Écologique & durable", desc: "On garde l'existant, on évite la déchetterie. Résiste 7 à 10 ans." },
  { icon: ShieldCheck, title: "Cover Styl' agréé", desc: "Matériau premium garanti, certifié pour usage intensif." },
  { icon: Wrench, title: "Entretien facile", desc: "Un coup d'éponge suffit. Résistant à l'eau et aux chocs légers." },
];

export const Features = () => (
  <section id="covering" className="py-20 lg:py-28">
    <div className="container-tight">
      <div className="max-w-2xl mb-14">
        <span className="badge-local mb-4">C'est quoi le covering ?</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
          Un revêtement adhésif <em className="font-script text-primary not-italic">haut de gamme</em>,
          appliqué sur vos surfaces existantes.
        </h2>
        <p className="mt-5 text-muted-foreground text-lg">
          Portes, murs, meubles, plans de travail, électroménagers — tout se transforme.
          Effet bois, marbre, béton, cuir : le résultat est ultra-réaliste.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <div key={i} className="group p-7 bg-card rounded-2xl border border-border/60 hover:border-primary/30 hover:shadow-card transition-all">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <it.icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{it.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
