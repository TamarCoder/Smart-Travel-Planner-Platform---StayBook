import { z } from "zod";

export const createTripSchema = z
  .object({
    title: z.string().trim().min(3, "Give your trip a name"),
    destination: z.string().min(1, "Pick a destination"),
    startDate: z.string().min(1, "Pick a start date"),
    endDate: z.string().min(1, "Pick a return date"),
    totalBudget: z.number().min(0, "Budget must be positive").max(1_000_000),
    coverImage: z.string().optional(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    path: ["endDate"],
    message: "Return must be after the start date",
  });

export type CreateTripFormInput = z.infer<typeof createTripSchema>;
