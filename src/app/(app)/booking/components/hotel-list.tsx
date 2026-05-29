import HotelCard, { type HotelCardProps } from "./hotel-card";

interface HotelListProps {
  hotels: HotelCardProps[];
}

export default function HotelList({ hotels }: HotelListProps) {
  return (
    <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} {...hotel} />
      ))}
    </section>
  );
}
