"use client";

import { useState } from "react";
import Image from "next/image";
import { LayoutGrid, X } from "lucide-react";

const photos = [
  "/assets/destination_santorini_greece__img_03.png",
  "/assets/destination_santorini_greece__img_04.png",
  "/assets/destination_santorini_greece__img_05.png",
  "/assets/destination_santorini_greece__img_06.png",
  "/assets/destination_santorini_greece__img_07.png",
  "/assets/destination_santorini_greece__img_09.png",
  "/assets/destination_santorini_greece__img_10.png",
];

export default function TripGallery() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="relative px-4 md:px-12 mt-6">
      <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-6 md:h-[600px]">
        <div className="col-span-2 md:row-span-2 relative h-72 md:h-auto rounded-xl overflow-hidden group cursor-pointer">
          <Image
            src="/assets/destination_santorini_greece__img_03.png"
            alt="Santorini, Greece"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 md:p-8">
            <span className="text-white/80 text-xs md:text-sm font-medium mb-2 uppercase tracking-wider">
              UNESCO World Heritage
            </span>
            <h1
              className="text-white text-3xl md:text-5xl font-bold"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
            >
              Santorini, Greece
            </h1>
          </div>
        </div>

        <div className="relative h-40 md:h-auto md:col-start-3 md:row-start-1 rounded-xl overflow-hidden group cursor-pointer">
          <Image
            src="/assets/destination_santorini_greece__img_04.png"
            alt="Santorini village street"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        <div className="relative h-40 md:h-auto md:col-start-3 md:row-start-2 rounded-xl overflow-hidden group cursor-pointer">
          <Image
            src="/assets/destination_santorini_greece__img_05.png"
            alt="Santorini coastline"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        <div className="col-span-2 md:col-span-1 md:col-start-4 md:row-start-1 md:row-span-2 relative h-52 md:h-auto rounded-xl overflow-hidden group cursor-pointer">
          <Image
            src="/assets/destination_santorini_greece__img_09.png"
            alt="Santorini sunset"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <button
            onClick={() => setModalOpen(true)}
            className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg px-5 py-3 rounded-full text-sm font-medium text-navy-950 flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <LayoutGrid className="h-4 w-4" />
            Show all photos
          </button>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[85vh] flex flex-col rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/30 shrink-0">
              <h3
                className="text-xl font-semibold text-navy-950"
                style={{ fontFamily: "var(--font-display)" }}
              >
                All Photos
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-text-secondary hover:text-navy-950 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {photos.map((src, i) => (
                <div
                  key={i}
                  className="relative h-40 sm:h-52 rounded-xl overflow-hidden cursor-pointer group"
                >
                  <Image
                    src={src}
                    alt={`Santorini photo ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
