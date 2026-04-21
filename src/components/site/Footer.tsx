import { PHONE_DISPLAY } from "@/lib/products";

export const Footer = () => (
  <footer className="bg-foreground text-background/80 py-12">
    <div className="container-tight grid md:grid-cols-3 gap-8 text-sm">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <img src="/favicon.png" alt="Logo Melmenuiserie" className="w-9 h-9 rounded-full object-cover" />
          <span className="font-semibold text-background">Melmenuiserie 971</span>
        </div>
        <p className="text-background/60 leading-relaxed">
          Artisan menuisier & spécialiste du covering Cover Styl' en Guadeloupe.
          35+ ans à transformer vos intérieurs.
        </p>
      </div>
      <div>
        <h4 className="text-background font-semibold mb-3 text-base">Contact</h4>
        <ul className="space-y-2">
          <li>📱 {PHONE_DISPLAY}</li>
          <li>📍 Guadeloupe — toute l'île</li>
          <li>📷 @melmenuiserie971</li>
        </ul>
      </div>
      <div>
        <h4 className="text-background font-semibold mb-3 text-base">Services</h4>
        <ul className="space-y-2">
          <li>Covering meubles & cuisines</li>
          <li>Vente vinyle Cover Styl'</li>
          <li>Menuiserie sur mesure</li>
          <li>Plan & modélisation 3D</li>
        </ul>
      </div>
    </div>
    <div className="container-tight mt-10 pt-6 border-t border-background/10 text-xs text-background/50 flex justify-between flex-wrap gap-2">
      <span>© {new Date().getFullYear()} Melmenuiserie 971 — Fait avec passion en Guadeloupe 🇬🇵</span>
      <span>Vendeur agréé Cover Styl'</span>
    </div>
  </footer>
);
