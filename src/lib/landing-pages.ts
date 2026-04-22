export type LandingPage = {
  slug: string;
  type: "location" | "service" | "guide";
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  keywords: string[];
  city?: string;
  postalArea?: string;
  sections: { heading: string; body: string }[];
  faq: { q: string; a: string }[];
};

const commonCTA =
  "Devis gratuit rapidement par WhatsApp, déplacement partout en Guadeloupe, plus de 500 références de vinyle premium Cover Styl' disponibles au mètre linéaire.";

const makeLocation = (
  slug: string,
  city: string,
  postalArea: string,
  blurb: string,
): LandingPage => ({
  slug,
  type: "location",
  city,
  postalArea,
  title: `Covering ${city}`,
  h1: `Covering & rénovation de meubles à ${city}`,
  metaTitle: `Covering ${city} (${postalArea}) — Rénovation meubles sans travaux | Melmenuiserie 971`,
  metaDescription: `Spécialiste du covering Cover Styl' à ${city}. Rénovation de cuisines, portes, plans de travail et meubles sans gros travaux. Devis gratuit, 500+ références. 0690 50 03 81.`,
  intro: `John, artisan menuisier établi en Guadeloupe depuis plus de 35 ans, intervient à ${city} (${postalArea}) pour rénover vos meubles, cuisines, portes et plans de travail grâce au covering premium Cover Styl'. ${blurb}`,
  keywords: [
    `covering ${city}`,
    `rénovation meubles ${city}`,
    `rénovation cuisine ${city}`,
    `pose vinyle adhésif ${city}`,
    `artisan menuisier ${city}`,
    `relooking meuble ${city}`,
  ],
  sections: [
    {
      heading: `Pourquoi choisir le covering à ${city} ?`,
      body: `À ${city}, remplacer une cuisine ou refaire l'intérieur d'une maison coûte cher et prend des semaines. Le covering (film vinyle adhésif haut de gamme) permet de transformer vos meubles, façades de cuisine, portes, plans de travail ou murs en 1 à 3 jours, pour un budget 4 à 5 fois inférieur à un remplacement complet. Zéro poussière, zéro démolition, résultat garanti plusieurs années même sous le climat tropical antillais.`,
    },
    {
      heading: `Nos prestations à ${city}`,
      body: `Rénovation de cuisines (façades, caissons, plans de travail), relooking de portes intérieures et d'entrée, habillage de meubles IKEA et sur-mesure, covering de comptoirs de commerces et restaurants, habillage d'ascenseurs et de halls d'immeuble. Nous proposons également la menuiserie sur mesure, le plan & la modélisation 3D avant travaux.`,
    },
    {
      heading: `Un résultat durable adapté au climat de ${city}`,
      body: `Le vinyle Cover Styl' est conçu pour résister à l'humidité, aux UV et aux variations de température — un atout essentiel en Guadeloupe. Anti-rayures, ignifuge M1, nettoyage à l'éponge humide : idéal pour les cuisines, salles de bain et locaux professionnels de ${city}.`,
    },
    {
      heading: "Comment se passe une intervention ?",
      body: `1. Vous nous contactez par WhatsApp ou téléphone avec quelques photos. 2. Nous établissons un devis gratuit sous 24h. 3. Vous choisissez parmi 500+ références (bois, marbre, béton, cuir, métal, unis, pailletés, textile). 4. Pose à domicile en 1 à 3 jours selon la surface. ${commonCTA}`,
    },
  ],
  faq: [
    {
      q: `Intervenez-vous à domicile à ${city} ?`,
      a: `Oui, nous nous déplaçons gratuitement à ${city} et dans toute la Guadeloupe pour le devis et la pose.`,
    },
    {
      q: `Combien coûte un covering de cuisine à ${city} ?`,
      a: `Le vinyle démarre à partir de 45 € le mètre linéaire. Une cuisine complète est généralement rénovée pour 4 à 5 fois moins cher qu'un remplacement. Nous établissons un devis gratuit personnalisé.`,
    },
    {
      q: "Quelle est la durée de vie du covering Cover Styl' ?",
      a: `Plus de 10 ans en utilisation intérieure normale, même en climat tropical. Le film est garanti ignifuge, anti-UV et résistant à l'humidité.`,
    },
    {
      q: "Peut-on rénover une cuisine sans la démonter ?",
      a: `Oui, c'est précisément l'avantage du covering : on habille les façades existantes. Aucune démolition, pas de poussière, vous conservez votre cuisine et elle semble neuve.`,
    },
  ],
});

const locations: LandingPage[] = [
  makeLocation(
    "covering-pointe-a-pitre",
    "Pointe-à-Pitre",
    "97110",
    "Nous intervenons sur tout le bassin pointois : centre-ville, Bergevin, Assainissement, Lauricisque.",
  ),
  makeLocation(
    "covering-les-abymes",
    "Les Abymes",
    "97139",
    "Interventions régulières sur Grand-Camp, Raizet, Dothémare et Boissard.",
  ),
  makeLocation(
    "covering-baie-mahault",
    "Baie-Mahault",
    "97122",
    "Spécialistes des cuisines et commerces sur Jarry, Destrellan et la zone industrielle.",
  ),
  makeLocation(
    "covering-le-gosier",
    "Le Gosier",
    "97190",
    "Rénovation de résidences, villas de location et restaurants du littoral.",
  ),
  makeLocation(
    "covering-sainte-anne",
    "Sainte-Anne",
    "97180",
    "Nombreuses interventions pour gîtes, meublés de tourisme et hôtels.",
  ),
  makeLocation(
    "covering-saint-francois",
    "Saint-François",
    "97118",
    "Rénovation de villas, marina et résidences haut de gamme.",
  ),
  makeLocation(
    "covering-le-moule",
    "Le Moule",
    "97160",
    "Intervention sur Le Moule, Damencourt, Portland et les quartiers résidentiels.",
  ),
  makeLocation(
    "covering-petit-bourg",
    "Petit-Bourg",
    "97170",
    "Rénovation de maisons individuelles et locaux professionnels sur Petit-Bourg, Bel Air, Vernou.",
  ),
  makeLocation(
    "covering-lamentin",
    "Lamentin",
    "97129",
    "Interventions régulières sur Lamentin et les communes voisines.",
  ),
  makeLocation(
    "covering-basse-terre",
    "Basse-Terre",
    "97100",
    "Déplacement sur l'ensemble de la Basse-Terre et ses quartiers historiques.",
  ),
  makeLocation(
    "covering-capesterre-belle-eau",
    "Capesterre-Belle-Eau",
    "97130",
    "Interventions sur Capesterre, Sainte-Marie et les sections rurales.",
  ),
  makeLocation(
    "covering-sainte-rose",
    "Sainte-Rose",
    "97115",
    "Rénovation de maisons et gîtes de la côte sous le vent.",
  ),
  makeLocation(
    "covering-morne-a-l-eau",
    "Morne-à-l'Eau",
    "97111",
    "Nous intervenons à Morne-à-l'Eau, Vieux-Bourg et Grippon.",
  ),
  makeLocation(
    "covering-petit-canal",
    "Petit-Canal",
    "97131",
    "Rénovation de meubles et cuisines dans toutes les sections de la commune.",
  ),
  makeLocation(
    "covering-port-louis",
    "Port-Louis",
    "97117",
    "Interventions sur le nord Grande-Terre, de Port-Louis à Anse-Bertrand.",
  ),
  makeLocation(
    "covering-marie-galante",
    "Marie-Galante",
    "97112",
    "Nous nous déplaçons à Grand-Bourg, Capesterre et Saint-Louis pour les chantiers importants.",
  ),
];

const services: LandingPage[] = [
  {
    slug: "renovation-meubles-sans-travaux",
    type: "service",
    title: "Rénover ses meubles sans gros travaux",
    h1: "Rénover vos meubles sans gros travaux ni démolition",
    metaTitle:
      "Rénover ses meubles sans travaux en Guadeloupe — Alternative peinture & remplacement | Melmenuiserie 971",
    metaDescription:
      "Rénovez cuisine, portes, plans de travail et meubles sans démolition ni peinture. Film vinyle adhésif Cover Styl' posé par un artisan menuisier en Guadeloupe. Devis gratuit.",
    intro:
      "Vous voulez rafraîchir votre cuisine ou redonner vie à vos meubles sans engager des semaines de travaux, de la poussière et un budget de remplacement complet ? Il existe une solution propre, rapide et durable utilisée par les professionnels : le covering, aussi appelé habillage vinyle ou film adhésif décoratif.",
    keywords: [
      "rénover meubles sans travaux",
      "rénover cuisine sans changer",
      "alternative peinture meubles",
      "habillage meuble adhésif",
      "relooker cuisine Guadeloupe",
    ],
    sections: [
      {
        heading: "Le principe : habiller au lieu de remplacer",
        body: `Au lieu de démonter et racheter, on recouvre les surfaces existantes (façades de cuisine, portes, plans de travail, tables, armoires, comptoirs…) avec un film vinyle haut de gamme de 0,3 mm d'épaisseur. Le rendu est bluffant : on ne voit pas la différence avec du bois massif, du marbre ou du béton ciré. Et la pose se fait en 1 à 3 jours.`,
      },
      {
        heading: "Pourquoi c'est plus malin que la peinture",
        body: `La peinture sur meuble de cuisine s'écaille, supporte mal l'humidité antillaise, et nécessite ponçage, sous-couche et plusieurs couches. Le covering, lui, est pré-traité en usine : anti-rayures, ignifuge M1, résistant aux UV et à l'humidité, nettoyage à l'éponge. Aucune odeur, aucune poussière, aucun délai de séchage.`,
      },
      {
        heading: "Pour quels meubles ?",
        body: `Cuisines (façades, caissons, plans de travail, crédences), portes intérieures et d'entrée, placards, tables, bureaux, bars, comptoirs de commerce, ascenseurs, cloisons, murs, plinthes… Tout ce qui est plan ou faiblement courbé peut être rénové.`,
      },
      {
        heading: "Combien ça coûte ?",
        body: `Le vinyle démarre à 45 €/m linéaire et peut monter à 95 €/m pour les finitions premium (marbre, paillettes, cuir). Une cuisine complète est rénovée pour 4 à 5 fois moins cher qu'un remplacement. Devis gratuit sous 24h.`,
      },
    ],
    faq: [
      {
        q: "Le covering, c'est quoi exactement ?",
        a: "C'est un film vinyle adhésif professionnel (marque Cover Styl') conçu pour habiller les meubles, cuisines et surfaces. Épais, rigide, décoratif et durable, il imite à la perfection le bois, le marbre, le métal, le cuir ou le béton.",
      },
      {
        q: "Est-ce que ça tient vraiment dans le temps ?",
        a: "Oui, plus de 10 ans en intérieur, même en climat tropical. Garanti ignifuge, résistant à l'eau, aux UV et aux rayures.",
      },
      {
        q: "Peut-on utiliser sa cuisine pendant les travaux ?",
        a: "Oui. Le chantier dure 1 à 3 jours selon la surface, sans démolition, sans odeur, sans poussière. Vous pouvez vivre normalement chez vous.",
      },
      {
        q: "Peut-on enlever le film plus tard ?",
        a: "Oui, le film est retirable à chaud sans abîmer le support d'origine.",
      },
    ],
  },
  {
    slug: "renovation-cuisine-guadeloupe",
    type: "service",
    title: "Rénover sa cuisine en Guadeloupe",
    h1: "Rénover votre cuisine en Guadeloupe sans tout remplacer",
    metaTitle:
      "Rénover sa cuisine en Guadeloupe — 4 à 5× moins cher qu'un remplacement | Melmenuiserie 971",
    metaDescription:
      "Rénovation de cuisine en Guadeloupe sans démolition : façades, plans de travail, crédence. Pose en 1 à 3 jours par un artisan local. Devis gratuit sous 24h.",
    intro:
      "Votre cuisine est fonctionnelle mais elle a vieilli ? Plutôt que d'engager 15 000 à 30 000 € dans une cuisine neuve, découvrez comment un artisan guadeloupéen la transforme en quelques jours pour une fraction du prix.",
    keywords: [
      "rénovation cuisine Guadeloupe",
      "relooker cuisine 971",
      "changer façades cuisine",
      "habillage plan de travail",
      "cuisine sans travaux",
    ],
    sections: [
      {
        heading: "Façades, plans de travail, crédence : tout est habillable",
        body: `Nous posons le film vinyle Cover Styl' directement sur vos façades, caissons, plans de travail et crédences existants. Rendu bois, marbre, béton ciré, cuir, métal brossé ou uni mat : vous choisissez parmi plus de 500 références.`,
      },
      {
        heading: "Un chantier court et propre",
        body: `Comptez 1 à 3 jours selon la taille de la cuisine. Aucune démolition, aucun gravats, aucune poussière. Vous continuez à utiliser votre cuisine le soir même.`,
      },
      {
        heading: "Un budget maîtrisé",
        body: `Rénovation de cuisine complète typiquement entre 1 500 € et 5 000 € selon la surface et la référence choisie, contre 15 000 à 30 000 € pour une cuisine neuve équivalente. Devis gratuit sous 24h.`,
      },
      {
        heading: "Adapté au climat antillais",
        body: `Le vinyle Cover Styl' est conçu pour résister à l'humidité, aux UV et aux graisses de cuisson — 100 % compatible avec le climat de la Guadeloupe.`,
      },
    ],
    faq: [
      {
        q: "Peut-on changer seulement les façades ?",
        a: "Oui, on peut habiller uniquement les façades si le reste vous convient. Ou traiter l'ensemble : façades + plan de travail + crédence pour un rendu totalement neuf.",
      },
      {
        q: "Est-ce compatible avec une cuisine IKEA ou sur-mesure ?",
        a: "Oui, tout support plan et propre reçoit le covering : MDF, mélaminé, stratifié, bois, métal.",
      },
      {
        q: "Résiste-t-il à la chaleur et aux projections ?",
        a: "Oui, il est ignifuge M1 et se nettoie à l'éponge humide. Parfait pour une cuisine.",
      },
    ],
  },
  {
    slug: "relooker-meubles-vinyle-adhesif",
    type: "service",
    title: "Relooker ses meubles avec du vinyle adhésif",
    h1: "Relooker vos meubles avec du vinyle adhésif pro",
    metaTitle:
      "Relooker ses meubles avec du film adhésif professionnel — Guadeloupe | Melmenuiserie 971",
    metaDescription:
      "Film vinyle adhésif décoratif posé par un pro en Guadeloupe : meubles, portes, tables, armoires. 500+ références. Rendu bluffant et durable. Devis gratuit.",
    intro:
      "Le film adhésif grand public des magasins de bricolage se décolle et déçoit souvent. Le vinyle professionnel Cover Styl', lui, imite à la perfection le bois, le marbre ou le métal et tient plus de 10 ans. Voici ce que ça change.",
    keywords: [
      "relooker meuble",
      "film adhésif décoratif",
      "vinyle pour meuble",
      "habillage meuble",
      "Cover Styl Guadeloupe",
    ],
    sections: [
      {
        heading: "Vinyle grand public vs vinyle professionnel",
        body: `Le rouleau de 5 € au supermarché est un film mince (0,08 mm), fragile, qui marque et se décolle en quelques mois. Le Cover Styl' est un vinyle technique de 0,3 mm, calandré, avec colle acrylique repositionnable et garantie 10+ ans.`,
      },
      {
        heading: "Des rendus qui trompent l'œil",
        body: `Bois chêne, noyer ou exotique ; marbre blanc, calacatta ou noir ; béton ciré ; cuir pleine fleur ; métal brossé ou cuivré ; pailletés ; unis mats ou brillants… 500+ références en stock.`,
      },
      {
        heading: "Pourquoi passer par un pro",
        body: `La pose propre (sans bulles ni plis) demande un dégraissage précis, un outillage dédié (raclette feutrée, pistolet à air chaud, cutter japonais) et un vrai savoir-faire sur les arêtes, angles et retours. Un pro garantit un rendu invisible et durable.`,
      },
    ],
    faq: [
      {
        q: "Peut-on poser soi-même ?",
        a: "Techniquement oui, mais le rendu pro demande de l'expérience. Nous vendons aussi le vinyle au mètre pour les bricoleurs avertis.",
      },
      {
        q: "Quels meubles peut-on relooker ?",
        a: "Cuisines, portes, tables, bureaux, armoires, bars, commodes, plinthes… Tout support plan et propre.",
      },
    ],
  },
  {
    slug: "qu-est-ce-que-le-covering",
    type: "guide",
    title: "Qu'est-ce que le covering ?",
    h1: "Qu'est-ce que le covering de meuble ? Guide complet",
    metaTitle:
      "Qu'est-ce que le covering ? Guide complet du film adhésif décoratif | Melmenuiserie 971",
    metaDescription:
      "Covering meubles : définition, principe, avantages, prix et durée de vie. Guide clair par un artisan menuisier en Guadeloupe, vendeur agréé Cover Styl'.",
    intro:
      "Le mot 'covering' vient de l'anglais 'to cover' (recouvrir). En décoration d'intérieur, il désigne la pose d'un film vinyle adhésif haut de gamme sur des meubles, cuisines, portes ou surfaces pour en changer totalement l'apparence — sans les remplacer.",
    keywords: [
      "qu'est-ce que le covering",
      "définition covering",
      "covering meuble",
      "film adhésif décoratif",
      "comment ça marche covering",
    ],
    sections: [
      {
        heading: "Définition simple",
        body: `Le covering (ou habillage vinyle décoratif) est une technique professionnelle qui consiste à appliquer un film plastique adhésif, épais et décoratif, sur une surface existante pour la rénover. On le connaît bien dans l'automobile (covering de voiture) ; appliqué à la maison, il permet de transformer une cuisine, une porte ou un meuble en quelques heures.`,
      },
      {
        heading: "Comment ça marche, concrètement ?",
        body: `1. On nettoie et dégraisse la surface. 2. On mesure et découpe le film. 3. On l'applique à la raclette, en chauffant au pistolet à air chaud sur les angles pour qu'il épouse parfaitement. 4. On arase les bords au cutter. Le résultat est définitif, lisse et sans bulles.`,
      },
      {
        heading: "Les avantages",
        body: `Rapide (1 à 3 jours), économique (4 à 5× moins cher qu'un remplacement), propre (aucune poussière ni démolition), durable (10+ ans), réversible (retirable à chaud), écologique (on évite de jeter les meubles existants), et personnalisable (500+ textures et couleurs).`,
      },
      {
        heading: "Les limites",
        body: `Le support doit être plan, propre, sec et solide. Les surfaces très abîmées ou gondolées nécessitent une préparation menuiserie au préalable (ce que nous proposons également). Le covering n'est pas adapté aux surfaces exposées en permanence à l'eau (douches, éviers).`,
      },
      {
        heading: "Covering Cover Styl'® : la référence pro",
        body: `Cover Styl' est la marque belge leader du vinyle architectural. Film 0,3 mm, ignifuge M1, classé contact alimentaire, résistant aux UV et à l'humidité. Garanti 10 ans intérieur. C'est le vinyle que nous utilisons exclusivement.`,
      },
    ],
    faq: [
      {
        q: "Covering et papier peint, c'est pareil ?",
        a: "Non. Le papier peint est en papier/intissé, se colle à la colle à eau, se déchire et marque. Le covering est un vinyle autocollant, rigide, technique, pensé pour les surfaces sollicitées comme les cuisines.",
      },
      {
        q: "Peut-on couvrir du carrelage ?",
        a: "Oui, sur murs et crédences de cuisine. Pour les sols, on utilise des gammes spécifiques.",
      },
      {
        q: "Combien de temps ça dure ?",
        a: "10 ans et plus en intérieur, y compris sous climat tropical.",
      },
      {
        q: "Où trouver un poseur en Guadeloupe ?",
        a: "Melmenuiserie 971 est vendeur agréé Cover Styl' sur l'île. Devis gratuit : 0690 50 03 81.",
      },
    ],
  },
  {
    slug: "alternative-peinture-meubles",
    type: "service",
    title: "Alternative à la peinture sur meubles",
    h1: "Alternative à la peinture sur meubles : plus propre, plus durable",
    metaTitle:
      "Alternative à la peinture sur meubles — Covering vinyle en Guadeloupe | Melmenuiserie 971",
    metaDescription:
      "Peindre un meuble est long, salissant et peu durable. Découvrez le covering : rendu pro, 500 finitions, pose en 1 à 3 jours. Artisan Guadeloupe.",
    intro:
      "Vous hésitez à peindre vos meubles de cuisine ou une porte ? Avant de sortir le ponçage et la sous-couche, comparez avec le covering : même budget (souvent moins), rendu supérieur, durabilité incomparable.",
    keywords: [
      "alternative peinture meuble",
      "peindre ou habiller cuisine",
      "ne pas peindre cuisine",
      "covering vs peinture",
    ],
    sections: [
      {
        heading: "Peinture : les inconvénients qu'on minimise",
        body: `Ponçage, sous-couche, 2 couches de finition, séchage entre chaque, odeurs, risques de coulures, durée de vie limitée sur meubles mélaminés, écaillage dans les zones humides et à fort usage. Et un rendu uni forcément — impossible d'imiter un marbre ou un vrai bois peint.`,
      },
      {
        heading: "Covering : la réponse moderne",
        body: `Pose directe en 1 à 3 jours, 500+ finitions (unis, marbres, bois, métal, paillettes), résistance à l'humidité antillaise, ignifuge, nettoyage éponge, durabilité 10+ ans. Même budget qu'une peinture pro.`,
      },
      {
        heading: "Quand garder la peinture ?",
        body: `Pour les surfaces très courbes, sculptées ou fortement en relief où le vinyle ne peut pas épouser la forme. Dans ces cas, on panache : covering sur les plans, peinture sur les reliefs.`,
      },
    ],
    faq: [
      {
        q: "Le covering coûte-t-il plus cher que la peinture ?",
        a: "Pour une cuisine, non : à rendu équivalent, covering et peinture pro sont dans la même fourchette. Le covering dure beaucoup plus longtemps.",
      },
      {
        q: "Est-ce qu'on sent la différence au toucher ?",
        a: "Les finitions premium (bois texturé, béton, cuir) reproduisent même le grain au toucher.",
      },
    ],
  },
];

export const landingPages: LandingPage[] = [...locations, ...services];

export const getLandingPageBySlug = (slug: string) =>
  landingPages.find((p) => p.slug === slug);

export const getLocationPages = () =>
  landingPages.filter((p) => p.type === "location");

export const getServicePages = () =>
  landingPages.filter((p) => p.type !== "location");
