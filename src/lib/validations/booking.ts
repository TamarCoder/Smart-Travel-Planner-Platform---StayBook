import { z } from "zod";

export const reserveSchema = z
  .object({
    checkIn: z.string().min(1, "Pick a check-in date"),
    checkOut: z.string().min(1, "Pick a return date"),
    guests: z.number().int().min(1, "At least one guest").max(12),
    rooms: z.number().int().min(1, "At least one room").max(8),
    tripId: z.string().optional(),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    path: ["checkOut"],
    message: "Return must be after check-in",
  });

export type ReserveInput = z.infer<typeof reserveSchema>;
