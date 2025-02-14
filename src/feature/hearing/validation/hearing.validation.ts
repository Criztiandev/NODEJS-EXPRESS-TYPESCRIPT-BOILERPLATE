import { z } from "zod";

export const HearingSchema = z.object({
  case: z
    .string()
    .min(1, { message: "case must be at least 1 character" })
    .max(155, { message: "case must be at most 155 characters" }),
  scheduleDate: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Invalid date format",
  }),
  hearingType: z
    .string()
    .min(1, { message: "hearingType must be at least 1 character" })
    .max(155, { message: "hearingType must be at most 155 characters" }),
  status: z
    .string()
    .min(1, { message: "status must be at least 1 character" })
    .max(155, { message: "status must be at most 155 characters" })
    .optional(),

  venue: z
    .string()
    .min(1, { message: "venue must be at least 1 character" })
    .max(155, { message: "venue must be at most 155 characters" }),
  attendees: z
    .array(
      z.object({
        party: z
          .string()
          .min(1, { message: "party must be at least 1 character" })
          .max(155, { message: "party must be at most 155 characters" }),
        attended: z.boolean(),
        remarks: z
          .string()
          .min(1, { message: "remarks must be at least 1 character" })
          .max(155, { message: "remarks must be at most 155 characters" }),
      })
    )
    .optional(),
  mediator: z
    .string()
    .min(1, { message: "mediator must be at least 1 character" })
    .max(155, { message: "mediator must be at most 155 characters" })
    .optional(),
  notes: z
    .string()
    .min(1, { message: "notes must be at least 1 character" })
    .max(155, { message: "notes must be at most 155 characters" })
    .optional(),
  nextHearingDate: z
    .date()
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .optional(),
});

export type HearingInput = z.infer<typeof HearingSchema>;
