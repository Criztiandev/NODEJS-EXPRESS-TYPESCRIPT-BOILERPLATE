import { z } from "zod";

export const MediatorSchema = z.object({
  userId: z.string().min(1, { message: "userId must be at least 1 character" }).max(155, { message: "userId must be at most 155 characters" }),
  position: z.string().min(1, { message: "position must be at least 1 character" }).max(155, { message: "position must be at most 155 characters" }),
  termStart: z.date().refine((date) => !isNaN(new Date(date).getTime()), { message: "Invalid date format" }),
  termEnd: z.date().refine((date) => !isNaN(new Date(date).getTime()), { message: "Invalid date format" }),
  isActive: z.boolean()
});

export type MediatorInput = z.infer<typeof MediatorSchema>;
