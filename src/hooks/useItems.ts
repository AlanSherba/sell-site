import { useState, useEffect } from "react";
import type { Item } from "../types/Item";
import { parseSheetCSV } from "../lib/parseSheet";

const SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL as string | undefined;

interface UseItemsResult {
  items: Item[];
  loading: boolean;
  error: string | null;
}

export function useItems(): UseItemsResult {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!SHEET_URL || SHEET_URL === "REPLACE_WITH_YOUR_PUBLISHED_CSV_URL") {
      setError("Google Sheet URL not configured.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchItems() {
      try {
        const response = await fetch(SHEET_URL!);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        const csv = await response.text();
        const parsed = parseSheetCSV(csv);
        if (!cancelled) {
          setItems(parsed);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error fetching items");
          setLoading(false);
        }
      }
    }

    fetchItems();

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading, error };
}
