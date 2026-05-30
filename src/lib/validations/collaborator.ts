import { z } from "zod";

export const inviteSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  role: z.enum(["Editor", "Viewer", "Companion"]),
});

export type InviteInput = z.infer<typeof inviteSchema>;
