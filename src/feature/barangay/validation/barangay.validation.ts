import { z } from "zod";

export const BarangaySchema = z.object({

});

export type BarangayInput = z.infer<typeof BarangaySchema>;
