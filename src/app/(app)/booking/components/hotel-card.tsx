import Image from "next/image";
import { Heart, Star, MapPin } from "lucide-react";

export interface HotelCardProps {
  image: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  priceNote: string;
  tags: string[];
  saved: boolean;
}

export default function HotelCard({
  image,
  name,
  location,
  rating,
  reviews,
  price,
  priceNote,
  tags,
  saved,
}: HotelCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-2xl">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <button
          className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:scale-110 transition-transform"
          aria-label="Save"
        >
          <Heart
            className={
              saved
                ? "h-5 w-5 fill-red-500 text-red-500"
                : "h-5 w-5 text-text-secondary"
            }
          />
        </button>
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium text-navy-950"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4 gap-3">
          <div>
            <h3
              className="text-lg font-semibold text-navy-950"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {name}
            </h3>
            <p className="text-sm text-text-secondary flex items-center gap-1 mt-0.5">
              <MapPin className="h-4 w-4 shrink-0" />
              {location}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center justify-end gap-1 text-sky-600 font-bold">
              <Star className="h-4 w-4 fill-sky-600 text-sky-600" />
              {rating}
            </div>
            <p className="text-xs text-text-muted mt-0.5">{reviews} reviews</p>
          </div>
        </div>

        <div className="flex justify-between items-end gap-3">
          <div className="text-text-secondary text-sm">
            <span className="text-navy-950 font-bold text-xl">{price}</span> / night
            <p className="text-xs">{priceNote}</p>
          </div>
          <button className="bg-sky-600/10 text-sky-600 border border-sky-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-sky-600 hover:text-white transition-all shrink-0">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
