import { z } from "zod";

export const HearingScheduleSchema = z.object({
  caseId: z.string(),
  scheduledDate: z.date(),
  status: z.string(),
  venue: z.string(),
  notes: z.string().optional(),
  scheduledBy: z.string(),
});

export type HearingScheduleInput = z.infer<typeof HearingScheduleSchema>;
