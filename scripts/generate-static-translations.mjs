import fs from "node:fs";
import { execFileSync } from "node:child_process";
import ts from "typescript";

const files = execFileSync("rg", [
  "--files",
  "app",
  "-g",
  "*.tsx",
  "-g",
  "!app/admin/**",
]).toString().trim().split("\n");

const phrases = new Set();
const add = (value) => {
  const text = value.replace(/\s+/g, " ").trim();
  if (
    text &&
    /^[A-Z]/.test(text) &&
    /[A-Za-z]/.test(text) &&
    !text.includes("@") &&
    !/^https?:|^\/|^[A-Za-z0-9_-]+$/.test(text)
  ) phrases.add(text);
};

for (const file of files) {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const visit = (node) => {
    if (ts.isJsxText(node)) add(node.text);
    if (
      ts.isJsxAttribute(node) &&
      ["placeholder", "title", "aria-label", "alt"].includes(node.name.text) &&
      node.initializer &&
      ts.isStringLiteral(node.initializer)
    ) add(node.initializer.text);
    if (
      ts.isStringLiteral(node) &&
      !ts.isImportDeclaration(node.parent) &&
      !ts.isExportDeclaration(node.parent) &&
      !(ts.isJsxAttribute(node.parent) && ["className", "href", "src"].includes(node.parent.name.text))
    ) add(node.text);
    ts.forEachChild(node, visit);
  };
  visit(source);
}

const sourcePhrases = [...phrases].sort();
const languages = ["hi", "mr", "ta", "bn"];
const generated = {};
const marker = (index) => `ZXQMARKER${String.fromCharCode(65 + index)}`;

for (const locale of languages) {
  generated[locale] = {};
  for (let offset = 0; offset < sourcePhrases.length; offset += 10) {
    const batch = sourcePhrases.slice(offset, offset + 10);
    const query = batch.map((text, index) => `${marker(index)} ${text}`).join("\n");
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "en");
    url.searchParams.set("tl", locale);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", query);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${locale} translation failed with ${response.status}`);
    const payload = await response.json();
    const translated = payload[0].map((part) => part[0]).join("");
    const lines = translated.trim().split("\n");
    if (lines.length !== batch.length) {
      throw new Error(`${locale} batch ${offset} returned ${lines.length}/${batch.length} lines: ${translated.slice(0, 500)}`);
    }
    for (let index = 0; index < batch.length; index += 1) {
      generated[locale][batch[index]] = lines[index]
        .replace(/^\S+\s*/, "")
        .replace(/ZXQMARKER[A-Z]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }
  }
}

fs.writeFileSync("app/translations.generated.json", `${JSON.stringify(generated, null, 2)}\n`);
console.log(`Generated ${sourcePhrases.length} phrases for ${languages.length} languages.`);
