import { Home, Building2 } from "lucide-react";

const residentiel = [
  "Cuisine — placards, crédences, plans de travail",
  "Salle de bain — meubles vasque, murs carrelés",
  "Salon — bibliothèques, meubles TV, tables",
  "Chambre — armoires, têtes de lit, commodes",
  "Couloirs — portes intérieures, murs d'accent",
];
const pro = [
  "Hôtels & Airbnb — décoration, meubles abîmés",
  "Restaurants & bars — comptoirs, vitrines, frigos",
  "Bureaux & coworking — cloisons, mobilier",
  "Magasins — rayonnages, façades, cabines",
];

export const Applications = () => (
  <section className="py-20 lg:py-28 bg-gradient-to-b from-background to-muted/40">
    <div className="container-tight">
      <div className="max-w-2xl mb-12">
        <span className="badge-local mb-4">Où l'appliquer ?</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
          Particuliers <em className="font-script text-primary not-italic">&</em> professionnels
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-8 bg-card rounded-3xl shadow-soft border border-border/60">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground grid place-items-center"><Home className="w-5 h-5" /></div>
            <h3 className="text-2xl font-semibold">Espaces résidentiels</h3>
          </div>
          <ul className="space-y-3">
            {residentiel.map(x => (
              <li key={x} className="flex gap-3 text-foreground/80">
                <span className="text-primary mt-1">●</span>{x}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-8 bg-card rounded-3xl shadow-soft border border-border/60">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-secondary text-secondary-foreground grid place-items-center"><Building2 className="w-5 h-5" /></div>
            <h3 className="text-2xl font-semibold">Commerces & entreprises</h3>
          </div>
          <ul className="space-y-3">
            {pro.map(x => (
              <li key={x} className="flex gap-3 text-foreground/80">
                <span className="text-secondary mt-1">●</span>{x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);
