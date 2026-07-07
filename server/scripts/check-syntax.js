import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverRoot = resolve(__dirname, "..");

const filesToCheck = [
  "index.js",
  "config/env.js",
  "libs/authorization.js",
  "libs/send-email.js",
  "libs/arcjet.js",
  "controllers/auth-controller.js",
  "controllers/workspace.js",
  "controllers/project.js",
  "controllers/task.js",
  "middleware/auth-middleware.js",
];

let hasFailure = false;

for (const file of filesToCheck) {
  const absolutePath = resolve(serverRoot, file);

  if (!existsSync(absolutePath)) {
    console.error(`[check] Missing expected file: ${file}`);
    hasFailure = true;
    continue;
  }

  console.log(`[check] node --check ${file}`);
  const result = spawnSync(process.execPath, ["--check", absolutePath], {
    cwd: serverRoot,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    hasFailure = true;
  }
}

if (hasFailure) {
  console.error("[check] Backend syntax checks failed.");
  process.exit(1);
}

console.log("[check] Backend syntax checks passed.");
