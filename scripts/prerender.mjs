import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const serverDir = path.join(root, "dist-server");

const locationSlugs = [
  "covering-pointe-a-pitre",
  "covering-les-abymes",
  "covering-baie-mahault",
  "covering-le-gosier",
  "covering-sainte-anne",
  "covering-saint-francois",
  "covering-le-moule",
  "covering-petit-bourg",
  "covering-lamentin",
  "covering-basse-terre",
  "covering-capesterre-belle-eau",
  "covering-sainte-rose",
  "covering-morne-a-l-eau",
  "covering-petit-canal",
  "covering-port-louis",
  "covering-marie-galante",
];

const serviceSlugs = [
  "renovation-meubles-sans-travaux",
  "renovation-cuisine-guadeloupe",
  "relooker-meubles-vinyle-adhesif",
  "qu-est-ce-que-le-covering",
  "alternative-peinture-meubles",
];

const routes = [
  "/",
  "/produit/bois",
  "/produit/marbre",
  "/produit/beton",
  "/produit/cuir",
  "/produit/metal",
  "/produit/paillettes",
  "/produit/uni",
  "/produit/textile",
  ...locationSlugs.map((s) => `/${s}`),
  ...serviceSlugs.map((s) => `/${s}`),
];

const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

const entryPath = path.join(serverDir, "entry-server.js");
const { render, landingPages = [] } = await import(
  pathToFileURL(entryPath).href
);
const landingBySlug = new Map(landingPages.map((p) => [p.slug, p]));

const SITE_URL = "https://www.covering-guadeloupe.com";
const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const injectSeoMeta = (html, url) => {
  const slug = url.replace(/^\//, "");
  const page = landingBySlug.get(slug);
  if (!page) return html;
  const canonical = `${SITE_URL}${url}`;
  const title = escapeHtml(page.metaTitle);
  const desc = escapeHtml(page.metaDescription);
  const keywords = escapeHtml(page.keywords.join(", "));
  const og = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE_URL}/hero-john.png" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${SITE_URL}/hero-john.png" />`;
  let out = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${title}</title>`,
  );
  if (/<meta\s+name="description"[^>]*>/.test(out)) {
    out = out.replace(
      /<meta\s+name="description"[^>]*>/,
      `<meta name="description" content="${desc}" />`,
    );
  } else {
    out = out.replace(
      "</title>",
      `</title>\n    <meta name="description" content="${desc}" />`,
    );
  }
  if (/<link\s+rel="canonical"[^>]*>/.test(out)) {
    out = out.replace(
      /<link\s+rel="canonical"[^>]*>/,
      `<link rel="canonical" href="${canonical}" />`,
    );
  } else {
    out = out.replace(
      "</head>",
      `    <link rel="canonical" href="${canonical}" />\n    <meta name="keywords" content="${keywords}" />${og}\n  </head>`,
    );
  }
  return out;
};

for (const url of routes) {
  const appHtml = render(url);
  let html = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );
  html = injectSeoMeta(html, url);

  const outPath =
    url === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, url, "index.html");

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  console.log(`prerendered ${url} -> ${path.relative(root, outPath)}`);
}

fs.rmSync(serverDir, { recursive: true, force: true });
