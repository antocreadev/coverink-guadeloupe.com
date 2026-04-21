import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { PHONE_DISPLAY } from "@/lib/products";

const links = [
  { href: "#covering", label: "Le covering" },
  { href: "#galerie", label: "Réalisations" },
  { href: "#boutique", label: "Boutique" },
  { href: "#about", label: "À propos" },
  { href: "#contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/60">
      <div className="container-tight flex items-center justify-between h-16">
        <a href="#top" className="flex items-center gap-2 group">
          <img
            src="/favicon.png"
            alt="Logo Melmenuiserie"
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="font-semibold tracking-tight">
            Mel<span className="text-primary">menuiserie</span>
            <span className="text-xs font-normal text-muted-foreground ml-1">
              971
            </span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-foreground/75 hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href={`tel:${PHONE_DISPLAY.replace(/\s/g, "")}`}
          className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-glow transition-colors"
        >
          <Phone className="w-4 h-4" />
          {PHONE_DISPLAY}
        </a>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 -mr-2"
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-tight py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-foreground/80"
              >
                {l.label}
              </a>
            ))}
            <a
              href={`tel:${PHONE_DISPLAY.replace(/\s/g, "")}`}
              className="py-2 text-primary font-medium flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
