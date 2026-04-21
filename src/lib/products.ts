// Bois
import boisImg1 from "@/assets/bois/scans/image.png";
import boisImg2 from "@/assets/bois/scans/image copy.png";
import boisImg3 from "@/assets/bois/scans/image copy 2.png";
import boisImg4 from "@/assets/bois/scans/image copy 3.png";

// Marbre
import marbreImg1 from "@/assets/marbre/image.png";
import marbreImg2 from "@/assets/marbre/image copy.png";
import marbreImg3 from "@/assets/marbre/image copy 2.png";
import marbreImg4 from "@/assets/marbre/image copy 3.png";

// Béton
import betonImg1 from "@/assets/beton/scans/image.png";
import betonImg2 from "@/assets/beton/scans/image copy.png";
import betonImg3 from "@/assets/beton/scans/image copy 2.png";

// Cuir
import cuirImg1 from "@/assets/cuir/scans/image.png";
import cuirImg2 from "@/assets/cuir/scans/image copy.png";
import cuirImg3 from "@/assets/cuir/scans/image copy 2.png";
import cuirImg4 from "@/assets/cuir/scans/image copy 3.png";
import cuirImg5 from "@/assets/cuir/scans/image copy 4.png";
import cuirImg6 from "@/assets/cuir/scans/image copy 5.png";
import cuirImg7 from "@/assets/cuir/scans/image copy 6.png";

// Métal
import metalImg1 from "@/assets/metal/scans/image.png";
import metalImg2 from "@/assets/metal/scans/image copy.png";
import metalImg3 from "@/assets/metal/scans/image copy 2.png";
import metalImg4 from "@/assets/metal/scans/image copy 3.png";
import metalImg5 from "@/assets/metal/scans/image copy 4.png";
import metalImg6 from "@/assets/metal/scans/image copy 5.png";
import metalImg7 from "@/assets/metal/scans/image copy 6.png";

// Paillettes
import paillettesImg1 from "@/assets/paillette/scans/image.png";
import paillettesImg2 from "@/assets/paillette/scans/image copy.png";
import paillettesImg3 from "@/assets/paillette/scans/image copy 2.png";
import paillettesImg4 from "@/assets/paillette/scans/image copy 3.png";
import paillettesImg5 from "@/assets/paillette/scans/image copy 4.png";
import paillettesImg6 from "@/assets/paillette/scans/image copy 5.png";
import paillettesImg7 from "@/assets/paillette/scans/image copy 6.png";
import paillettesImg8 from "@/assets/paillette/scans/image copy 7.png";

// Couleur uni
import uniImg1 from "@/assets/couleur/scans/image.png";
import uniImg2 from "@/assets/couleur/scans/image copy.png";
import uniImg3 from "@/assets/couleur/scans/image copy 2.png";
import uniImg4 from "@/assets/couleur/scans/image copy 3.png";
import uniImg5 from "@/assets/couleur/scans/image copy 4.png";
import uniImg6 from "@/assets/couleur/scans/image copy 5.png";
import uniImg7 from "@/assets/couleur/scans/image copy 6.png";

// Textile
import textileImg1 from "@/assets/textile/scans/image.png";
import textileImg2 from "@/assets/textile/scans/image copy.png";
import textileImg3 from "@/assets/textile/scans/image copy 2.png";
import textileImg4 from "@/assets/textile/scans/image copy 3.png";

export type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  images?: string[];
  description: string;
  detailedDescription?: string;
  highlight?: boolean;
};

export const products: Product[] = [
  {
    id: "bois",
    name: "Covering meuble ton bois",
    price: 72,
    unit: "/ml",
    image: boisImg1,
    images: [boisImg1, boisImg2, boisImg3, boisImg4],
    description:
      "Effet bois ultra-réaliste, du chêne clair au noyer profond. Idéal cuisine, portes, plans de travail.",
    detailedDescription:
      "Vinyle covering effet bois de qualité professionnelle. Disponible en plusieurs finitions : chêne clair, chêne foncé, noyer, wengé. Parfait pour rénover vos cuisines, armoires, portes et plans de travail sans gros travaux.",
  },

  {
    id: "marbre",
    name: "Covering meuble ton marbre",
    price: 72,
    unit: "/ml",
    image: marbreImg1,
    images: [marbreImg1, marbreImg2, marbreImg3, marbreImg4],
    description:
      "Veines élégantes type Carrare ou Calacatta. Apporte une touche luxueuse à vos crédences et meubles.",
    detailedDescription:
      "Covering marbre haut de gamme avec veines réalistes. Finitions Carrare blanc, Calacatta, Marquina. Donne une allure chic et moderne à vos intérieurs, salle de bain, cuisine ou salon.",
  },

  {
    id: "beton",
    name: "Covering meuble ton béton",
    price: 72,
    unit: "/ml",
    image: betonImg1,
    images: [betonImg1, betonImg2, betonImg3],
    description:
      "Look industriel et minéral. Parfait pour un intérieur contemporain, salle de bain ou salon.",
    detailedDescription:
      "Vinyle effet béton brut et ciré. Apporte un style industriel minimaliste. Idéal pour les cuisines modernes, salles de bain, bureaux et projets de décoration contemporaine.",
  },

  {
    id: "cuir",
    name: "Covering meuble gamme cuir",
    price: 120,
    unit: "/ml",
    image: cuirImg1,
    images: [
      cuirImg1,
      cuirImg2,
      cuirImg3,
      cuirImg4,
      cuirImg5,
      cuirImg6,
      cuirImg7,
    ],
    description:
      "Gamme premium effet cuir grainé. Têtes de lit, bureaux, comptoirs — finition haut de gamme.",
    detailedDescription:
      "Covering cuir premium avec grainure réaliste. Effet cuir classe A haute qualité. Disponible en noir, brun, bordeaux et caramel. Parfait pour les projets haut de gamme.",
    highlight: true,
  },

  {
    id: "metal",
    name: "Covering meuble ton métal",
    price: 72,
    unit: "/ml",
    image: metalImg1,
    images: [
      metalImg1,
      metalImg2,
      metalImg3,
      metalImg4,
      metalImg5,
      metalImg6,
      metalImg7,
    ],
    description:
      "Inox brossé, alu, cuivre. Donne du caractère aux électroménagers et façades.",
    detailedDescription:
      "Covering effet métallique : inox brossé, aluminium anodisé, cuivre patiné, or rose. Idéal pour moderniser vos électroménagers et façades.",
  },

  {
    id: "paillettes",
    name: "Covering meuble ton paillettes",
    price: 72,
    unit: "/ml",
    image: paillettesImg1,
    images: [
      paillettesImg1,
      paillettesImg2,
      paillettesImg3,
      paillettesImg4,
      paillettesImg5,
      paillettesImg6,
      paillettesImg7,
      paillettesImg8,
    ],
    description:
      "Finition pailletée or, argent, champagne. Pour des accents glamour et lumineux.",
    detailedDescription:
      "Covering pailletté haute gamme avec effet scintillant. Coloris : or, argent, champagne, rose gold. Pour des accents de luxe et de luminosité.",
  },

  {
    id: "uni",
    name: "Covering meuble couleur uni",
    price: 72,
    unit: "/ml",
    image: uniImg1,
    images: [uniImg1, uniImg2, uniImg3, uniImg4, uniImg5, uniImg6, uniImg7],
    description:
      "Plus de 100 coloris mats, satinés ou brillants. Personnalisez vos meubles à l'infini.",
    detailedDescription:
      "Gamme unis la plus complète : plus de 100 coloris. Finitions mats, satinés, brillants et texturés. Personnalisez vos meubles selon vos envies.",
  },

  {
    id: "textile",
    name: "Covering meuble ton textile",
    price: 72,
    unit: "/ml",
    image: textileImg1,
    images: [textileImg1, textileImg2, textileImg3, textileImg4],
    description:
      "Effet lin, cuir tissé, jute. Une matière chaleureuse pour têtes de lit et cloisons.",
    detailedDescription:
      "Covering textile texturé : lin, coton, jute, cuir tissé. Apporte une chaleur et une authenticité à vos projets de décoration intérieure.",
  },
];

export const WHATSAPP = "590690500381";
export const PHONE_DISPLAY = "0690 50 03 81";

export const buildWhatsAppLink = (message: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

export const getProductById = (id: string) => products.find((p) => p.id === id);

export const getProductImages = (productId: string): string[] => {
  const product = getProductById(productId);
  if (product?.images) return product.images;
  return [product?.image || ""].filter(Boolean);
};
