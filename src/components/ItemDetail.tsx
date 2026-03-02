import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Item } from "../types/Item";

interface ItemDetailProps {
  item: Item;
}

export function ItemDetail({ item }: ItemDetailProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const allImages = [
    ...(item.mainImage ? [item.mainImage] : []),
    ...item.additionalImages,
  ];
  const navigate = useNavigate();

  // Reset image index when item changes
  useEffect(() => {
    setCurrentImage(0);
  }, [item.id]);

  // Lock body scroll while overlay is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        navigate("/");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Backdrop */}
      <Link
        to="/"
        className="fixed inset-0 bg-white/60"
        aria-label="Close detail"
      />

      {/* Content panel */}
      <div className="relative mx-auto mt-8 mb-8 max-w-3xl bg-white p-6 shadow-xl border-4 border-black">
        <Link
          to="/"
          className="absolute top-[-2px] right-[-64px] text-4xl bg-white border-4 border-black w-[48px] h-[48px] flex items-center justify-center leading-none text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          &times;
        </Link>

        {/* Main image */}
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img
            src={allImages[currentImage]}
            alt={item.name}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Thumbnail strip */}
        {allImages.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden border-2 ${
                  i === currentImage
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Item info */}
        <h2 className="mt-4 text-2xl font-bold text-gray-900">{item.name}</h2>
        <p className="mt-1 text-[#A3FF5C] text-3xl font-bold ">
          ${item.price.toFixed(2)}
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
            Condition: {item.condition}
          </span>
          {item.sold && (
            <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
              SOLD
            </span>
          )}
        </div>

        <p className="mt-4 leading-relaxed text-gray-700">
          {item.description}
        </p>
      </div>
    </div>
  );
}
