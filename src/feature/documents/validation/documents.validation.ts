import { z } from "zod";
import { Types } from "mongoose";

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (value: string) => {
  return Types.ObjectId.isValid(value);
};

// Constants for document types
const DOCUMENT_TYPES = [
  "KPFORM-1",
  "KPFORM-2",
  "KPFORM-3",
  "KPFORM-4",
  "KPFORM-5",
  "KPFORM-6",
  "KPFORM-7",
  "KPFORM-8",
  "KPFORM-9",
  "KPFORM-10",
  "KPFORM-11",
  "KPFORM-12",
  "KPFORM-13",
  "KPFORM-14",
  "KPFORM-15",
  "KPFORM-16",
  "KPFORM-17",
  "KPFORM-18",
  "KPFORM-19",
  "KPFORM-20",
  "KPFORM-21",
  "KPFORM-22",
  "KPFORM-23",
  "KPFORM-24",
  "KPFORM-25",
] as const;

// Create Document Schema for creation
export const createDocumentSchema = z.object({
  type: z.enum(DOCUMENT_TYPES, {
    errorMap: () => ({ message: "Document type must be a valid KP form type" }),
  }),
  fileName: z
    .string()
    .min(1, "File name is required")
    .max(255, "File name cannot exceed 255 characters"),
  fileUrl: z
    .string()
    .url("File URL must be a valid URL")
    .min(1, "File URL is required"),
  uploadedBy: z
    .string()
    .refine(isValidObjectId, {
      message: "uploadedBy must be a valid MongoDB ObjectId",
    })
    .optional(),
});

// Create Document Schema for update
export const updateDocumentSchema = z.object({
  type: z
    .enum(DOCUMENT_TYPES, {
      errorMap: () => ({
        message: "Document type must be a valid KP form type",
      }),
    })
    .optional(),
  fileName: z
    .string()
    .min(1, "File name is required")
    .max(255, "File name cannot exceed 255 characters")
    .optional(),
  fileUrl: z
    .string()
    .url("File URL must be a valid URL")
    .min(1, "File URL is required")
    .optional(),
  uploadedBy: z
    .string()
    .refine(isValidObjectId, {
      message: "uploadedBy must be a valid MongoDB ObjectId",
    })
    .optional(),
});

// Create Document Schema for soft delete
export const deleteDocumentSchema = z.object({
  isDeleted: z.literal(true),
  deletedAt: z.date().default(() => new Date()),
});

// Type definitions derived from the Zod schemas
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type DeleteDocumentInput = z.infer<typeof deleteDocumentSchema>;

// Export document types for use elsewhere
export const documentTypes = DOCUMENT_TYPES;
