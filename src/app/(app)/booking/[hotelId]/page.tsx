import { HotelDetail } from "./components/hotel-detail";

export default async function HotelPage({
  params,
}: {
  params: Promise<{ hotelId: string }>;
}) {
  const { hotelId } = await params;
  return <HotelDetail hotelId={hotelId} />;
}
