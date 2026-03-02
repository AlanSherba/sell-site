import { writeFileSync } from "fs";
import { join } from "path";
import { parseSheetCSV } from "../src/lib/parseSheet";

const SHEET_URL =
  process.env.GOOGLE_SHEET_URL ??
  "REPLACE_WITH_YOUR_PUBLISHED_CSV_URL";

// --- Code generation ---

interface SerializableItem {
  id: string;
  name: string;
  price: number;
  mainImage: string;
  description: string;
  additionalImages: string[];
  condition: string;
  sold: boolean;
}

function generateTypeScript(items: SerializableItem[]): string {
  const serialized = items
    .map(
      (item) =>
        `  ${JSON.stringify(item, null, 2).replace(/\n/g, "\n  ")},`
    )
    .join("\n");

  return `// Auto-generated from Google Sheet. Do not edit manually.
// Run \`npm run generate\` to refresh from the sheet.
import type { Item } from "../types/Item";

export const items: Item[] = [
${serialized}
];
`;
}

// --- Main ---

async function main() {
  if (SHEET_URL === "REPLACE_WITH_YOUR_PUBLISHED_CSV_URL") {
    console.warn(
      "⚠ No Google Sheet URL configured. Set GOOGLE_SHEET_URL env var or update the URL in scripts/generate-items.ts."
    );
    console.warn("  Skipping generation — using existing src/data/items.ts.");
    return;
  }

  console.log("Fetching Google Sheet CSV...");
  const response = await fetch(SHEET_URL);
  if (!response.ok)
    throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);

  const csv = await response.text();
  const items = parseSheetCSV(csv);

  if (items.length === 0) {
    console.warn("Sheet has no data rows. Writing empty items array.");
  }

  const output = generateTypeScript(items);
  const outPath = join(import.meta.dirname, "../src/data/items.ts");
  writeFileSync(outPath, output, "utf-8");

  console.log(`Generated ${items.length} items → ${outPath}`);
}

main().catch((err) => {
  console.error("Generate failed:", err);
  process.exit(1);
});
