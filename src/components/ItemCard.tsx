import { Link } from "react-router-dom";
import type { Item } from "../types/Item";

interface ItemCardProps
{
  item: Item;
}

export function ItemCard({ item }: ItemCardProps)
{
  return (
    <Link
      to={`/?item=${item.id}`}
      className="group block overflow-hidden bg-white"
    >
      <div className="relative aspect-square overflow-hidden p-4">
        {item.mainImage && (
          <img
            src={item.mainImage}
            alt={item.name}
            className="h-full w-full object-cover group-hover:scale-115 transition"
          />
        )}
        {item.sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="bg-white px-3 py-1 text-lg font-bold text-black">
              SOLD
            </span>
          </div>
        )}
        {!item.sold && (
          <div className="absolute top-0 left-0 p-4 flex flex-col gap-0 items-start">
            {/* name */}
            <div className="pl-2 pr-2 bg-white/90 inline-block backdrop-blur-[32px] w-auto max-w-full">
              <span className="text-lg font-semibold text-black">
                {item.name}
              </span>
            </div>
            {/* price */}
            <div
              className={`pl-2 pr-2 inline-block w-auto max-w-full ${
                item.price === 0 ? "bg-[#2D2D2D]" : "bg-[#A3FF5C]"
              }`}
            >
              <span
                className={`text-lg font-semibold ${
                  item.price === 0 ? "text-[#A3FF5C]" : "text-[#2D2D2D]"
                }`}
              >
                {item.price === 0 ? "FREE!" : `$${item.price.toFixed(0)}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
