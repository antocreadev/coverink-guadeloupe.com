import g1 from "@/assets/avant-apres-cuisine.png";
import g2 from "@/assets/avant-apres-beton.png";
import g3 from "@/assets/cuisine-bois.jpg";
import t1 from "@/assets/table-avant.jpg";
import t2 from "@/assets/table-apres.jpg";
import ReactCompareImage from "react-compare-image";

export const Gallery = () => (
  <section id="galerie" className="py-20 lg:py-28">
    <div className="container-tight">
      <div className="max-w-2xl mb-12">
        <span className="badge-local mb-4">Avant / Après</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
          Des transformations{" "}
          <em className="font-script text-primary not-italic">
            spectaculaires
          </em>
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Chaque projet est unique. Voici quelques réalisations récentes en
          Guadeloupe.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <figure className="rounded-3xl overflow-hidden shadow-card bg-card">
          <img
            src={g1}
            alt="Avant après cuisine relookée par covering"
            loading="lazy"
            className="w-full h-auto"
          />
        </figure>
        <figure className="rounded-3xl overflow-hidden shadow-card bg-card">
          <img
            src={g2}
            alt="Cuisine effet béton après covering"
            loading="lazy"
            className="w-full h-auto"
          />
        </figure>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl overflow-hidden shadow-card">
          <ReactCompareImage
            leftImage={t1}
            rightImage={t2}
            leftImageAlt="Table avant covering"
            rightImageAlt="Table après covering"
          />
        </div>
        <figure className="rounded-3xl overflow-hidden shadow-card aspect-[3/4] relative">
          <img
            src={g3}
            alt="Cuisine moderne avec plan de travail effet bois"
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <figcaption className="absolute bottom-4 left-4 right-4 text-cream text-sm font-medium drop-shadow-lg">
            Plan de travail rénové — effet bois chêne
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
);
