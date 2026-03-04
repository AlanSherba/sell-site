import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Item } from "../types/Item";

interface ItemDetailProps
{
  item: Item;
}

export function ItemDetail({ item }: ItemDetailProps)
{
  const [currentImage, setCurrentImage] = useState(0);
  const allImages = [
    ...(item.mainImage ? [item.mainImage] : []),
    ...item.additionalImages,
  ];
  const navigate = useNavigate();

  // Reset image index when item changes
  useEffect(() =>
  {
    setCurrentImage(0);
  }, [item.id]);

  // Lock body scroll while overlay is open
  useEffect(() =>
  {
    document.body.style.overflow = "hidden";
    return () =>
    {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard navigation
  useEffect(() =>
  {
    function handleKeyDown(e: KeyboardEvent)
    {
      if (e.key === "Escape")
      {
        navigate("/");
      } else if (e.key === "ArrowLeft")
      {
        setCurrentImage((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight")
      {
        setCurrentImage((prev) => Math.min(allImages.length - 1, prev + 1));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, allImages.length]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white/90 backdrop-blur-[16px] cursor-pointer" onClick={() => navigate("/")}>
      {/* Sticky header bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-300 bg-white p-0 cursor-default" onClick={(e) => e.stopPropagation()}>
        <h2 className="truncate text-lg m-4 font-bold text-gray-900">{item.name}</h2>
        <Link
          to="/"
          className="bg-red-600 hover:bg-red-700 px-8 py-1 text-[20px] font-bold text-white h-full flex items-center"
        >
          X CLOSE
        </Link>
      </div>

      {/* Content panel */}
      <div className="mx-auto w-full max-w-3xl overflow-y-auto p-6 cursor-default" onClick={(e) => e.stopPropagation()}>
        {/* Main image */}
        <div className="relative max-h-[60vh] overflow-hidden flex items-center justify-center">
          <img
            src={allImages[currentImage]}
            alt={item.name}
            className="max-h-[60vh] w-full object-contain"
          />
          {allImages.length > 1 && currentImage > 0 && (
            <button
              onClick={() => setCurrentImage((prev) => prev - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-black/50 text-white hover:bg-black/70 cursor-pointer"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {allImages.length > 1 && currentImage < allImages.length - 1 && (
            <button
              onClick={() => setCurrentImage((prev) => prev + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-black/50 text-white hover:bg-black/70 cursor-pointer"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Thumbnail strip */}
        {allImages.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden border-2 ${i === currentImage
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
        <div className="mt-4 flex flex-row flex-wrap gap-2">
          <span className="bg-[#A3FF5C] text-xl font-bold text-[#2D2D2D] px-2 py-0.5 inline-block w-fit">
            {item.price === 0 ? "FREE" : `$${item.price.toFixed(2)}`}
          </span>
          <div className="px-2 bg-gray-100 h-fill text-sm text-gray-black flex items-center justify-center text-center">
            Condition: {item.condition}
          </div>
          {item.sold && (
          <div className="px-2 bg-red-100 h-fill text-sm text-red-700 bold flex items-center justify-center text-center">
            SOLD
          </div>
          )}
        </div>
        {item.presale && (
          <div className="mt-3 bg-yellow-400 text-[#2D2D2D] px-4 py-3">
            <span className="font-bold">Presale</span>
            <p className="mt-1">This item is for sale but we currently need it to live our lives. You can contact us to buy it, but it will be sold closer to our move date.</p>
          </div>
        )}
        {item.retailLink && (
          <a
            href={item.retailLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-[16px] text-blue-600 hover:text-blue-800 underline"
          >
            View original listing
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        <p className="mt-4 text-[20px] leading-relaxed text-black">
          {item.description}
        </p>

        {!item.sold && import.meta.env.VITE_WHATSAPP_NUMBER && (
          <a
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'm interested in ${item.name}${item.price === 0 ? " (FREE)" : ` ($${item.price.toFixed(2)})`}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 border-4 border-black bg-[#25D366] px-4 py-3 text-lg font-bold text-white hover:bg-[#1ebe5b]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contact Me to Buy
          </a>
        )}
      </div>
    </div>
  );
}
