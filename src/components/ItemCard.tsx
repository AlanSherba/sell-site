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
      to={`?item=${item.id}`}
      className="group block overflow-hidden bg-white border-2 border-black"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.mainImage}
          alt={item.name}
          className="h-full w-full object-cover group-hover:scale-105"
        />
        {item.sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="bg-white px-3 py-1 text-lg font-bold text-black">
              SOLD
            </span>
          </div>
        )}
        {!item.sold && (
          <div className="absolute top-0 left-0 p-4 flex flex-col gap-2 items-start">
            {/* name */}
            <div className="pl-2 pr-2 bg-white/90 inline-block backdrop-blur-[32px] w-auto max-w-full">
              <span className="text-lg font-semibold text-black">
                {item.name}
              </span>
            </div>
            {/* price */}
            <div className="pl-2 pr-2 bg-[#A3FF5C] inline-block w-auto max-w-full">
              <span className="text-lg font-semibold text-[#2D2D2D] drop-shadow-sm">
                ${item.price.toFixed(0)}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
