import { z } from "zod";

export const SettlementSchema = z.object({
  case: z.string().min(1, { message: "case is required" }),
  settlementDate: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Invalid date format",
  }),
  settlementType: z
    .string()
    .min(1, { message: "settlementType must be at least 1 character" })
    .max(155, { message: "settlementType must be at most 155 characters" }),
  terms: z
    .string()
    .min(1, { message: "terms must be at least 1 character" })
    .max(155, { message: "terms must be at most 155 characters" }),
  isComplied: z.boolean().optional(),
  complianceDate: z
    .date()
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .optional(),
  witnesses: z.array(z.string()).optional(),
  mediator: z.string().min(1, { message: "mediator is required" }),
  document: z.string().optional(),
});

export type SettlementInput = z.infer<typeof SettlementSchema>;
