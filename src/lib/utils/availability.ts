export interface StayInput {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
}

export function getNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  if (!Number.isFinite(diff) || diff <= 0) return 0;
  return Math.round(diff / 86_400_000);
}

export function getStayTotal(pricePerNight: number, nights: number): number {
  return Math.max(0, pricePerNight * nights);
}

function fastHash(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return hash >>> 0;
}

export function isHotelAvailable(
  hotelId: string,
  checkIn?: string,
  checkOut?: string,
): boolean {
  if (!checkIn || !checkOut) return true;
  const seed = fastHash(`${hotelId}|${checkIn}|${checkOut}`);
  return seed % 7 !== 0;
}

export function describeStay(stay: StayInput): string {
  if (!stay.checkIn || !stay.checkOut) return "Pick your dates";
  const nights = getNights(stay.checkIn, stay.checkOut);
  if (!nights) return "Pick your dates";
  const guests = stay.guests ?? 2;
  const rooms = stay.rooms ?? 1;
  return `${nights} ${nights === 1 ? "night" : "nights"} · ${guests} ${guests === 1 ? "guest" : "guests"} · ${rooms} ${rooms === 1 ? "room" : "rooms"}`;
}
