import mongoose from "mongoose";
import { z } from "zod";

export const SettlementSchema = z.object({
  case: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid case ID",
  }),
  caseParticipants: z
    .string()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "Invalid case ID",
    }),
  type: z.enum(["amicable", "mediated", "conciliated", "arbitrated"]),
  status: z.enum([
    "draft",
    "pending",
    "signed",
    "complied",
    "repudiated",
    "non_complied",
    "enforced",
  ]),
  remarks: z.string().optional(),
});

export type SettlementInput = z.infer<typeof SettlementSchema>;
