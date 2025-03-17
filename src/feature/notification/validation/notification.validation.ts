import { z } from "zod";

export const NotificationSchema = z.object({
  recipient: z.string().min(1, { message: "recipient is required" }),
  type: z
    .string()
    .min(1, { message: "type must be at least 1 character" })
    .max(155, { message: "type must be at most 155 characters" }),
  title: z
    .string()
    .min(1, { message: "title must be at least 1 character" })
    .max(155, { message: "title must be at most 155 characters" }),
  message: z
    .string()
    .min(1, { message: "message must be at least 1 character" })
    .max(155, { message: "message must be at most 155 characters" }),
  relatedCase: z.string().optional(),
  isRead: z.boolean().optional(),
  readAt: z
    .date()
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .optional(),
  deliveryMethod: z
    .string()
    .min(1, { message: "deliveryMethod must be at least 1 character" })
    .max(155, { message: "deliveryMethod must be at most 155 characters" }),
  deliveryStatus: z
    .string()
    .min(1, { message: "deliveryStatus must be at least 1 character" })
    .max(155, { message: "deliveryStatus must be at most 155 characters" })
    .optional(),
});

export type NotificationInput = z.infer<typeof NotificationSchema>;
