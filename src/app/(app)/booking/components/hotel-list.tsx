import HotelCard, { type HotelCardProps } from "./hotel-card";

interface Hotel extends HotelCardProps {
  id: string;
}

interface HotelListProps {
  hotels: Hotel[];
}

export default function HotelList({ hotels }: HotelListProps) {
  return (
    <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {hotels.map(({ id, ...hotel }) => (
        <HotelCard key={id} {...hotel} />
      ))}
    </section>
  );
}
