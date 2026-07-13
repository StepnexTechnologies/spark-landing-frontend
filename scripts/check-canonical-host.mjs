import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const forbiddenOrigin = "https://" + "sparkonomy.com";
const directories = ["app", "components", "data", "lib", "public"];
const rootFiles = [".env.example", "middleware.ts", "next.config.ts"];
const textExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".txt"]);
const matches = [];

function inspectFile(path) {
  if (!textExtensions.has(extname(path)) && !rootFiles.includes(relative(root, path))) {
    return;
  }

  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    if (line.includes(forbiddenOrigin)) {
      matches.push(`${relative(root, path)}:${index + 1}`);
    }
  });
}

function walk(path) {
  for (const name of readdirSync(path)) {
    const child = join(path, name);
    if (statSync(child).isDirectory()) {
      walk(child);
    } else {
      inspectFile(child);
    }
  }
}

directories.forEach((directory) => walk(join(root, directory)));
rootFiles.forEach((file) => inspectFile(join(root, file)));

if (matches.length > 0) {
  console.error(`Found non-canonical ${forbiddenOrigin} URLs:`);
  matches.forEach((match) => console.error(`- ${match}`));
  process.exit(1);
}

console.log("Canonical host check passed.");
