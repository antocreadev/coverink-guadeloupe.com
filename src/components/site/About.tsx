import johnImg from "@/assets/john-artisan.png";
import { Award, MapPin, Recycle } from "lucide-react";

export const About = () => (
  <section id="about" className="py-20 lg:py-28">
    <div className="container-tight grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div className="relative">
        <div className="absolute -inset-6 bg-gradient-wood rounded-3xl opacity-15 blur-3xl" />
        <img src={johnImg} alt="John, artisan menuisier spécialiste covering en Guadeloupe"
          loading="lazy" className="relative rounded-3xl shadow-elegant w-full" />
      </div>
      <div className="space-y-6">
        <span className="badge-local">À propos</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
          John, votre menuisier <em className="font-script text-primary not-italic">passionné</em> en Guadeloupe
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          La valeur d'un métier est, avant tout, celle d'un homme. Depuis plus de
          35 ans, je transforme les intérieurs guadeloupéens avec exigence et passion.
          Aujourd'hui, je vous propose une expertise rare : le <strong className="text-foreground">covering Cover Styl'</strong>.
        </p>
        <div className="grid gap-4">
          {[
            { icon: Award, t: "35+ ans d'expérience", d: "Menuisier certifié, expert en covering agréé Cover Styl'." },
            { icon: MapPin, t: "Intervention toute la Guadeloupe", d: "Savoir-faire local, devis sur place et délais courts." },
            { icon: Recycle, t: "Démarche écoresponsable", d: "Donner une seconde vie à vos meubles plutôt que de jeter." },
          ].map((x, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-muted/50">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-primary text-primary-foreground grid place-items-center">
                <x.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">{x.t}</div>
                <div className="text-sm text-muted-foreground">{x.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
