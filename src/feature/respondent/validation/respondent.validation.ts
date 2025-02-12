import { z } from "zod";

export const RespondentSchema = z.object({
  userId: z.string().min(1, { message: "userId must be at least 1 character" }).max(155, { message: "userId must be at most 155 characters" }),
  identificationNumber: z.string().min(1, { message: "identificationNumber must be at least 1 character" }).max(155, { message: "identificationNumber must be at most 155 characters" })
});

export type RespondentInput = z.infer<typeof RespondentSchema>;
