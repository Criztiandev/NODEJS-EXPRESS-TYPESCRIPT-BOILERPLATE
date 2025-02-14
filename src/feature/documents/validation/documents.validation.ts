import { z } from "zod";

export const DocumentsSchema = z.object({
  case: z.undefined,
  documentType: z.string().min(1, { message: "documentType must be at least 1 character" }).max(155, { message: "documentType must be at most 155 characters" }),
  fileUrl: z.string().url({ message: "Invalid URL format" }).max(2083, { message: "URL is too long" }),
  fileName: z.string().min(1, { message: "fileName must be at least 1 character" }).max(155, { message: "fileName must be at most 155 characters" }),
  mimeType: z.string().optional().min(1, { message: "mimeType must be at least 1 character" }).max(155, { message: "mimeType must be at most 155 characters" }),
  fileSize: z.number().optional(),
  createdBy: z.undefined,
  signatures: z.array().optional(),
  isActive: z.boolean().optional()
});

export type DocumentsInput = z.infer<typeof DocumentsSchema>;
