import { Phone, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PHONE_DISPLAY, buildWhatsAppLink } from "@/lib/products";

export const ContactCTA = () => (
  <section id="contact" className="py-20 lg:py-28 bg-gradient-hero text-primary-foreground relative overflow-hidden">
    <div className="absolute inset-0 opacity-10" style={{
      backgroundImage: "radial-gradient(circle at 20% 30%, hsl(var(--accent)) 0%, transparent 40%), radial-gradient(circle at 80% 70%, hsl(var(--primary-glow)) 0%, transparent 50%)"
    }} />
    <div className="container-tight relative text-center max-w-3xl">
      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary-foreground/15 mb-5">
        Vous avez un projet ?
      </span>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
        Prêt à transformer
        <span className="block font-script text-accent text-5xl sm:text-6xl lg:text-7xl mt-2">votre intérieur ?</span>
      </h2>
      <p className="mt-6 text-lg text-primary-foreground/85">
        Contactez-moi pour que nous parlions ensemble de votre projet,
        afin que je puisse vous proposer la meilleure solution possible :
        une cuisine de rêve, qui vous ressemble.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-elegant">
          <a href={buildWhatsAppLink("Bonjour John, j'aimerais discuter d'un projet de covering.")}>
            <MessageCircle className="w-5 h-5 mr-1" /> WhatsApp
          </a>
        </Button>
        <Button size="lg" variant="outline" asChild className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
          <a href={`tel:${PHONE_DISPLAY.replace(/\s/g,'')}`}>
            <Phone className="w-5 h-5 mr-1" /> {PHONE_DISPLAY}
          </a>
        </Button>
        <Button size="lg" variant="outline" asChild className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
          <a href="https://instagram.com/melmenuiserie971" target="_blank" rel="noreferrer">
            <Instagram className="w-5 h-5 mr-1" /> @melmenuiserie971
          </a>
        </Button>
      </div>
    </div>
  </section>
);
