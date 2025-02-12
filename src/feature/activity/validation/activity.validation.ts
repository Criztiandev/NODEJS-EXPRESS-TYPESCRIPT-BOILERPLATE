import { z } from "zod";

export const ActivitySchema = z.object({

});

export type ActivityInput = z.infer<typeof ActivitySchema>;
