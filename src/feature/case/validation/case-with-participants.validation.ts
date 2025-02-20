import { z } from "zod";
import { CaseValidation } from "./case.validation";
import { isValidObjectId } from "mongoose";

export const CaseWithParticipantsValidation = CaseValidation.omit({
  participants: true,
}).extend({
  participants: z.object({
    complainants: z.array(
      z.string().refine((id) => isValidObjectId(id), {
        message: "Invalid complainant id",
      })
    ),
    respondents: z.array(
      z.string().refine((id) => isValidObjectId(id), {
        message: "Invalid respondent id",
      })
    ),
    witnesses: z
      .array(
        z.string().refine((id) => isValidObjectId(id), {
          message: "Invalid witness id",
        })
      )
      .optional(),
  }),
});

export type CaseWithParticipantsInput = z.infer<
  typeof CaseWithParticipantsValidation
>;
