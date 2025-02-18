import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const HearingValidation = z.object({
  case: z.string().refine((id) => isValidObjectId(id), {
    message: "Invalid case id",
  }),
  scheduleDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid date format",
  }),
  hearingType: z.enum(["mediation", "conciliation", "arbitration"]),
  status: z.enum([
    "scheduled",
    "ongoing",
    "completed",
    "cancelled",
    "rescheduled",
  ]),
  venue: z
    .string()
    .min(1, { message: "venue must be at least 1 character" })
    .max(155, { message: "venue must be at most 155 characters" }),
  notes: z
    .string()
    .min(1, { message: "notes must be at least 1 character" })
    .max(155, { message: "notes must be at most 155 characters" })
    .optional(),
  nextHearingDate: z
    .string()
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: "Invalid date format",
    })
    .optional(),
});

export type HearingInput = z.infer<typeof HearingValidation>;
