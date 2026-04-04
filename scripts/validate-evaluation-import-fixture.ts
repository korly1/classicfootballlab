/**
 * Validates the Bianca golden import JSON against Zod schemas.
 * Run: npx tsx scripts/validate-evaluation-import-fixture.ts
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { EvaluationImportSchema } from "../src/features/evaluations/schemas/evaluation-import-schema";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturePath = join(
  __dirname,
  "../src/features/evaluations/__fixtures__/bianca_rich_v1.import.json",
);

const raw = readFileSync(fixturePath, "utf8");
const parsed: unknown = JSON.parse(raw);
const result = EvaluationImportSchema.safeParse(parsed);

if (!result.success) {
  console.error("Fixture validation failed:");
  console.error(JSON.stringify(result.error.issues, null, 2));
  process.exit(1);
}

console.log("OK: bianca_rich_v1.import.json matches EvaluationImportSchema.");
