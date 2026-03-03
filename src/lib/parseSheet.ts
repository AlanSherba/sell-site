import type { Item } from "../types/Item";

const VALID_CONDITIONS = ["new", "like-new", "good", "fair", "poor"] as const;

interface RawRow {
  [key: string]: string;
}

// --- Minimal RFC 4180 CSV parser ---

export function parseCSV(text: string): string[][] {
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

// --- Google Drive link conversion ---

function toDriveDirectUrl(url: string): string {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (match) return `https://lh3.googleusercontent.com/d/${match[1]}=w1000`;
  return url;
}

// --- Row to item mapping ---

function rowToItem(raw: RawRow, rowIndex: number): Item | null {
  const id = raw["id"]?.trim();
  if (!id) return null;

  const name = raw["name"]?.trim();
  if (!name) return null;

  const priceStr = raw["price"]?.trim();
  const price = Number(priceStr);
  if (!isFinite(price) || price < 0)
    throw new Error(`Row ${rowIndex + 2}: invalid price "${priceStr}"`);

  const rawImage = raw["mainImage"]?.trim();
  const mainImage = rawImage ? toDriveDirectUrl(rawImage) : null;
  const description = raw["description"]?.trim() ?? "";

  const additionalImages = (raw["additionalImages"] ?? "")
    .split(";")
    .map((s) => toDriveDirectUrl(s.trim()))
    .filter(Boolean);

  let condition = raw["condition"]?.trim().toLowerCase() ?? "good";
  if (!VALID_CONDITIONS.includes(condition as (typeof VALID_CONDITIONS)[number])) {
    console.warn(
      `Row ${rowIndex + 2}: unknown condition "${condition}", defaulting to "good"`
    );
    condition = "good";
  }

  const tags = (raw["tags"] ?? "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  const sold = raw["sold"]?.trim().toLowerCase() === "true";
  const retailLink = raw["retailLink"]?.trim() ?? "";

  return {
    id,
    name,
    price,
    mainImage,
    description,
    additionalImages,
    tags,
    condition: condition as Item["condition"],
    sold,
    retailLink,
  };
}

// --- Parse full CSV into Item[] ---

export function parseSheetCSV(csvText: string): Item[] {
  const rows = parseCSV(csvText);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim());
  const dataRows = rows.slice(1);

  return dataRows
    .map((row, i) => {
      const raw: RawRow = {};
      headers.forEach((h, j) => {
        raw[h] = row[j] ?? "";
      });
      return rowToItem(raw, i);
    })
    .filter((item): item is Item => item !== null);
}
