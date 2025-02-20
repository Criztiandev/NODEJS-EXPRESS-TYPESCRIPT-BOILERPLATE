import { z } from "zod";
import { ParticipantsSchema } from "./participants.validation";
import { isValidObjectId } from "mongoose";
import { CaseStatus } from "../constants";

export const CaseParticipantValidation = z.object({
  case: z.string().refine((id) => isValidObjectId(id), {
    message: "Invalid case ID",
  }),
  complainants: z.array(ParticipantsSchema),
  respondents: z.array(ParticipantsSchema),
  witnesses: z.array(ParticipantsSchema),
  caseStatus: z.nativeEnum(CaseStatus),
});

export const CaseparticipantsInputSchema = CaseParticipantValidation.pick({
  case: true,
}).extend({
  participants: z.object({
    complainants: z.array(
      z.string().refine((id) => isValidObjectId(id), {
        message: "Invalid complainant ID",
      })
    ),
    respondents: z.array(
      z.string().refine((id) => isValidObjectId(id), {
        message: "Invalid respondent ID",
      })
    ),
    witnesses: z.array(
      z.string().refine((id) => isValidObjectId(id), {
        message: "Invalid witness ID",
      })
    ),
  }),
});

export type CaseParticipantsInput = z.infer<typeof CaseparticipantsInputSchema>;
export type CaseParticipantValidation = z.infer<
  typeof CaseParticipantValidation
>;
