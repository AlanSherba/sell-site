import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useItems } from "../hooks/useItems";
import { ItemGrid } from "../components/ItemGrid";
import { ItemDetail } from "../components/ItemDetail";

export function HomePage()
{
  const [searchParams] = useSearchParams();
  const { items, loading, error } = useItems();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const FREE_TAG = "FREE";

  const allTags = useMemo(
    () => {
      const tags = [...new Set(items.flatMap((i) => i.tags))].sort();
      if (items.some((i) => i.price === 0)) tags.unshift(FREE_TAG);
      return tags;
    },
    [items]
  );

  const filteredItems = useMemo(
    () =>
      selectedTag === null
        ? items
        : selectedTag === FREE_TAG
          ? items.filter((i) => i.price === 0)
          : items.filter((i) => i.tags.includes(selectedTag)),
    [items, selectedTag]
  );

  function toggleTag(tag: string)
  {
    setSelectedTag((prev) => (prev === tag ? null : tag));
  }

  const selectedItemId = searchParams.get("item");
  const selectedItem = selectedItemId
    ? items.find((i) => i.id === selectedItemId) ?? null
    : null;

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white border-b-4">
        <div className="mx-auto max-w-7xl px-4 py-6 flex flex-row items-center">
          <h1 className="text-3xl font-bold text-gray-900 mr-8">Digital Yard Sale</h1>
          {allTags.length > 0 && (
            <div className="flex gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-sm font-medium ${selectedTag === tag
                      ? "text-gray-900"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  style={selectedTag === tag ? { backgroundColor: "#A3FF5C" } : undefined}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              ))}
            </div>
          )}
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
        {!loading && !error && (
          <>
            <section className="px-4 py-8 max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold">About Us</h1>
              <p>We are moving, so we are selling stuff. Ronald will write something here later...</p>
            </section>
            <ItemGrid items={filteredItems} />
          </>
        )}
      </main>
      {selectedItem && <ItemDetail item={selectedItem} />}
    </div>
  );
}
