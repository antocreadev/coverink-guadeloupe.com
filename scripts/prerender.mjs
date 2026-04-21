import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const serverDir = path.join(root, "dist-server");

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
];

const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

const entryPath = path.join(serverDir, "entry-server.js");
const { render } = await import(pathToFileURL(entryPath).href);

for (const url of routes) {
  const appHtml = render(url);
  const html = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );

  const outPath =
    url === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, url, "index.html");

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  console.log(`prerendered ${url} -> ${path.relative(root, outPath)}`);
}

fs.rmSync(serverDir, { recursive: true, force: true });
