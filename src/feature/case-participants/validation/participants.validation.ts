import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const ParticipantsSchema = z.object({
  resident: z.string().refine((id) => isValidObjectId(id), {
    message: "Invalid resident ID",
  }),
  status: z
    .string()
    .min(1, { message: "Status must be at least 1 character" })
    .max(155, { message: "Status must be at most 155 characters" }),
  joinedDate: z.date(),
  withdrawalDate: z.date(),
  withdrawalReason: z
    .string()
    .min(1, { message: "Withdrawal reason must be at least 1 character" })
    .max(155, { message: "Withdrawal reason must be at most 155 characters" }),
  remarks: z
    .string()
    .min(1, { message: "Remarks must be at least 1 character" })
    .max(155, { message: "Remarks must be at most 155 characters" }),
});

export type ParticipantsInput = z.infer<typeof ParticipantsSchema>;
