import { z } from "zod";

export const AuditSchema = z.object({
  user: z.string().min(1, { message: "user is required" }),
  action: z
    .string()
    .min(1, { message: "action must be at least 1 character" })
    .max(155, { message: "action must be at most 155 characters" }),
  entityType: z
    .string()
    .min(1, { message: "entityType must be at least 1 character" })
    .max(155, { message: "entityType must be at most 155 characters" }),
  entityId: z.string().min(1, { message: "entityId is required" }),
  changes: z.object({
    before: z.any().optional(),
    after: z.any().optional(),
  }),
  ipAddress: z
    .string()
    .min(1, { message: "ipAddress must be at least 1 character" })
    .max(155, { message: "ipAddress must be at most 155 characters" })
    .optional(),
  userAgent: z
    .string()
    .min(1, { message: "userAgent must be at least 1 character" })
    .max(155, { message: "userAgent must be at most 155 characters" })
    .optional(),
});

export type AuditInput = z.infer<typeof AuditSchema>;
