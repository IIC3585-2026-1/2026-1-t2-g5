import { cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const publicDir = join(__dirname, "public");
const dataOut = join(publicDir, "data");

mkdirSync(dataOut, { recursive: true });
cpSync(join(repoRoot, "data", "users.json"), join(dataOut, "users.json"));
cpSync(join(repoRoot, "data", "transactions.json"), join(dataOut, "transactions.json"));

await esbuild.build({
  entryPoints: [join(__dirname, "entry.cjs")],
  bundle: true,
  platform: "browser",
  format: "iife",
  globalName: "QueryDemo",
  outfile: join(publicDir, "query-demo.js"),
  logLevel: "info",
});

console.log("Demo lista en demo/public (query-demo.js + data/).");
