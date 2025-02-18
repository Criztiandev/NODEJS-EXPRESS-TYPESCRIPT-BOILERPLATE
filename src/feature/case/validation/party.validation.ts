import { isValidObjectId } from "mongoose";
import { z } from "zod";

const PartyValidation = z.object({
  residents: z.array(
    z.string().refine((id) => isValidObjectId(id), {
      message: "Invalid user id",
    })
  ),
  partyType: z.enum(["complainant", "respondent", "witness"]).optional(),
  status: z.enum(["active", "withdrawn", "resolved"]).optional(),
  withdrawalDate: z
    .date()
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .optional(),
  remarks: z.string().optional(),
});

export type PartyInput = z.infer<typeof PartyValidation>;

export default PartyValidation;
