import data from "@/data/booking.json";

export type BookingInfo = typeof data;

export function getBookingInfo(): BookingInfo {
  return data;
}
