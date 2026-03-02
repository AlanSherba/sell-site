import { writeFileSync } from "fs";
import { join } from "path";

const SHEET_URL =
  process.env.GOOGLE_SHEET_URL ??
  "REPLACE_WITH_YOUR_PUBLISHED_CSV_URL";

const VALID_CONDITIONS = ["new", "like-new", "good", "fair", "poor"] as const;

// --- Minimal RFC 4180 CSV parser ---

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          i++;
        }
      } else {
        field += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ",") {
        row.push(field);
        field = "";
        i++;
      } else if (ch === "\r") {
        i++;
      } else if (ch === "\n") {
        row.push(field);
        field = "";
        rows.push(row);
        row = [];
        i++;
      } else {
        field += ch;
        i++;
      }
    }
  }

  // Last field / last row
  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

// --- Row to item mapping ---

interface RawRow {
  [key: string]: string;
}

function rowToItem(raw: RawRow, rowIndex: number) {
  const id = raw["id"]?.trim();
  if (!id) throw new Error(`Row ${rowIndex + 2}: missing "id"`);

  const name = raw["name"]?.trim();
  if (!name) throw new Error(`Row ${rowIndex + 2}: missing "name"`);

  const priceStr = raw["price"]?.trim();
  const price = Number(priceStr);
  if (!isFinite(price) || price < 0)
    throw new Error(`Row ${rowIndex + 2}: invalid price "${priceStr}"`);

  const mainImage = raw["mainImage"]?.trim() ?? "";
  const description = raw["description"]?.trim() ?? "";

  const additionalImages = (raw["additionalImages"] ?? "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  let condition = raw["condition"]?.trim().toLowerCase() ?? "good";
  if (!VALID_CONDITIONS.includes(condition as (typeof VALID_CONDITIONS)[number])) {
    console.warn(
      `Row ${rowIndex + 2}: unknown condition "${condition}", defaulting to "good"`
    );
    condition = "good";
  }

  const sold = raw["sold"]?.trim().toLowerCase() === "true";

  return { id, name, price, mainImage, description, additionalImages, condition, sold };
}

// --- Code generation ---

function generateTypeScript(items: ReturnType<typeof rowToItem>[]): string {
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
  const rows = parseCSV(csv);

  if (rows.length < 2) {
    console.warn("Sheet has no data rows. Writing empty items array.");
    const output = generateTypeScript([]);
    writeFileSync(join(import.meta.dirname, "../src/data/items.ts"), output, "utf-8");
    return;
  }

  const headers = rows[0].map((h) => h.trim());
  const dataRows = rows.slice(1);

  const items = dataRows
    .filter((row) => row[0]?.trim())
    .map((row, i) => {
      const raw: RawRow = {};
      headers.forEach((h, j) => {
        raw[h] = row[j] ?? "";
      });
      return rowToItem(raw, i);
    });

  const output = generateTypeScript(items);
  const outPath = join(import.meta.dirname, "../src/data/items.ts");
  writeFileSync(outPath, output, "utf-8");

  console.log(`Generated ${items.length} items → ${outPath}`);
}

main().catch((err) => {
  console.error("Generate failed:", err);
  process.exit(1);
});
