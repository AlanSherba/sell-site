import { useSearchParams } from "react-router-dom";
import { useItems } from "../hooks/useItems";
import { ItemGrid } from "../components/ItemGrid";
import { ItemDetail } from "../components/ItemDetail";

export function HomePage()
{
  const [searchParams] = useSearchParams();
  const { items, loading, error } = useItems();

  const selectedItemId = searchParams.get("item");
  const selectedItem = selectedItemId
    ? items.find((i) => i.id === selectedItemId) ?? null
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b-4">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Yard Sale</h1>
        </div>
      </header>
      <main className="mx-auto h-100% max-w-7xl mt-[-4px]">
        {loading && (
          <div className="flex justify-center py-20">
            <p className="text-lg text-gray-500">Loading items...</p>
          </div>
        )}
        {error && (
          <div className="flex justify-center py-20">
            <p className="text-lg text-red-600">Error: {error}</p>
          </div>
        )}
        {!loading && !error && <ItemGrid items={items} />}
      </main>
      {selectedItem && <ItemDetail item={selectedItem} />}
    </div>
  );
}
