import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const HearingValidation = z.object({
  case: z.string().refine((id) => isValidObjectId(id), {
    message: "Invalid case id",
  }),
  type: z.enum(["mediation", "conciliation", "arbitration"]),

  status: z
    .enum([
      "scheduled",
      "ongoing",
      "completed",
      "cancelled",
      "rescheduled",
      "no_show",
    ])
    .optional(),

  schedule: z.object({
    date: z.string().refine(
      (date) => {
        const dateObj = new Date(date);
        return !isNaN(dateObj.getTime()) && dateObj >= new Date();
      },
      {
        message: "Date must be valid and not in the past",
      }
    ),
    startTime: z.string().refine(
      (time) => {
        const timeObj = new Date(time);
        return !isNaN(timeObj.getTime()) && timeObj >= new Date();
      },
      {
        message: "Start time must be valid and not in the past",
      }
    ),
    endTime: z.string().refine(
      (time) => {
        const timeObj = new Date(time);
        return !isNaN(timeObj.getTime()) && timeObj >= new Date();
      },
      {
        message: "End time must be valid and not in the past",
      }
    ),
    venue: z
      .string()
      .min(1, { message: "venue must be at least 1 character" })
      .max(155, { message: "venue must be at most 155 characters" }),
  }),

  rescheduledFrom: z
    .object({
      originalDate: z.string().refine(
        (date) => {
          const dateObj = new Date(date);
          return !isNaN(dateObj.getTime()) && dateObj >= new Date();
        },
        {
          message: "Original date must be valid and not in the past",
        }
      ),
      reason: z.string(),
    })
    .optional(),

  attendance: z.object({
    complainants: z.array(
      z.object({
        user: z.string().refine((id) => isValidObjectId(id), {
          message: "Invalid user id",
        }),
        status: z.enum(["present", "absent", "late"]),
        arrivalTime: z
          .string()
          .refine((time) => !isNaN(new Date(time).getTime()), {
            message: "Invalid time format",
          }),
        remarks: z.string(),
      })
    ),
    respondents: z.array(
      z.object({
        user: z.string().refine((id) => isValidObjectId(id), {
          message: "Invalid user id",
        }),
        status: z.enum(["present", "absent", "late"]),
        arrivalTime: z
          .string()
          .refine((time) => !isNaN(new Date(time).getTime()), {
            message: "Invalid time format",
          }),
        remarks: z.string(),
      })
    ),
    witnesses: z
      .array(
        z.object({
          user: z.string().refine((id) => isValidObjectId(id), {
            message: "Invalid user id",
          }),
          status: z.enum(["present", "absent", "late"]),
          arrivalTime: z
            .string()
            .refine((time) => !isNaN(new Date(time).getTime()), {
              message: "Invalid time format",
            }),
          remarks: z.string(),
        })
      )
      .optional(),
  }),

  officials: z.object({
    mediator: z.object({
      user: z.string().refine((id) => isValidObjectId(id), {
        message: "Invalid user id",
      }),
      remarks: z.string(),
    }),
    pangkatMembers: z
      .array(
        z.object({
          user: z.string().refine((id) => isValidObjectId(id), {
            message: "Invalid user id",
          }),
          remarks: z.string(),
        })
      )
      .optional(),
  }),

  proceedings: z.object({
    summary: z.string(),
    agreements: z.array(
      z.object({
        description: z.string(),
        agreedBy: z.array(
          z.object({
            resident: z.string().refine((id) => isValidObjectId(id), {
              message: "Invalid user id",
            }),
            party: z.enum(["complainant", "respondent"]),
          })
        ),
      })
    ),
  }),

  outcome: z.object({
    result: z.enum(["settled", "not_settled", "for_followup", "escalated"]),
    settlementReached: z.boolean(),
    reasonIfNotSettled: z.string(),
  }),

  attachments: z.array(
    z.object({
      type: z.enum(["minutes", "evidence", "agreement", "other"]),
      fileName: z.string(),
      fileUrl: z.string(),
      uploadedBy: z.string().refine((id) => isValidObjectId(id), {
        message: "Invalid user id",
      }),
    })
  ),
});

export type HearingInput = z.infer<typeof HearingValidation>;
