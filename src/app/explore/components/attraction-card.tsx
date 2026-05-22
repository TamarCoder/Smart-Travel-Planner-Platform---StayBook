import Image from "next/image";
import { Heart, Clock } from "lucide-react";

interface AttractionCardProps {
  title: string;
  description: string;
  price: string;
  image: string;
  saved?: boolean;
  hours?: string;
  recommended?: boolean;
  avatarCount?: number;
}

export default function AttractionCard({
  title,
  description,
  price,
  image,
  saved,
  hours,
  recommended,
  avatarCount,
}: AttractionCardProps) {
  return (
    <div className="min-w-[260px] sm:min-w-[290px] md:min-w-[320px] bg-white/80 backdrop-blur-xl border border-white/20 p-1.5 rounded-2xl shadow-xl hover:-translate-y-2 transition-all cursor-pointer group">
      <div className="relative h-36 sm:h-40 md:h-44 rounded-xl overflow-hidden mb-3">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {saved && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Heart className="h-3 w-3 text-sky-600 fill-sky-600" />
            <span className="text-[10px] font-bold text-navy-950">Saved</span>
          </div>
        )}
      </div>
      <div className="px-3 pb-3">
        <h3
          className="text-base md:text-xl font-semibold text-navy-950"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        <p className="text-xs md:text-sm text-text-secondary line-clamp-2 mt-1">{description}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="text-sky-600 font-bold text-sm">{price}</span>
          {hours && (
            <div className="flex items-center gap-1 text-text-secondary">
              <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="text-[11px]">{hours}</span>
            </div>
          )}
          {recommended && (
            <div className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
              Recommended
            </div>
          )}
          {avatarCount && (
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white bg-slate-300" />
              ))}
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white bg-surface-hover flex items-center justify-center text-[8px] font-bold text-text-secondary">
                +{avatarCount}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
