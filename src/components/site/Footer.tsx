import { Link } from "react-router-dom";
import { PHONE_DISPLAY } from "@/lib/products";
import { getLocationPages, getServicePages } from "@/lib/landing-pages";

export const Footer = () => {
  const locations = getLocationPages();
  const services = getServicePages();
  const midpoint = Math.ceil(locations.length / 2);

  return (
    <footer className="bg-foreground text-background/80 py-12">
      <div className="container-tight grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img
              src="/favicon.png"
              alt="Logo Melmenuiserie"
              className="w-9 h-9 rounded-full object-cover"
            />
            <span className="font-semibold text-background">
              Melmenuiserie 971
            </span>
          </div>
          <p className="text-background/60 leading-relaxed">
            Artisan menuisier & spécialiste du covering Cover Styl' en
            Guadeloupe. 35+ ans à transformer vos intérieurs.
          </p>
          <ul className="mt-4 space-y-2">
            <li>📱 {PHONE_DISPLAY}</li>
            <li>📍 Guadeloupe — toute l'île</li>
            <li>📷 @melmenuiserie971</li>
          </ul>
        </div>

        <div>
          <h4 className="text-background font-semibold mb-3 text-base">
            Rénovation
          </h4>
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  to={`/${s.slug}`}
                  className="hover:text-background transition-colors"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-background font-semibold mb-3 text-base">
            Communes
          </h4>
          <ul className="space-y-2">
            {locations.slice(0, midpoint).map((l) => (
              <li key={l.slug}>
                <Link
                  to={`/${l.slug}`}
                  className="hover:text-background transition-colors"
                >
                  {l.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-background font-semibold mb-3 text-base">
            &nbsp;
          </h4>
          <ul className="space-y-2">
            {locations.slice(midpoint).map((l) => (
              <li key={l.slug}>
                <Link
                  to={`/${l.slug}`}
                  className="hover:text-background transition-colors"
                >
                  {l.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container-tight mt-10 pt-6 border-t border-background/10 text-xs text-background/50 flex justify-between flex-wrap gap-2">
        <span>
          © {new Date().getFullYear()} Melmenuiserie 971 — Fait avec passion en
          Guadeloupe 🇬🇵
        </span>
        <span>Vendeur agréé Cover Styl'</span>
      </div>
    </footer>
  );
};
