import { Document, ObjectId } from "mongoose";
  import { SoftDeleteFields } from "../../../core/base/repository/base.repository";
  
  export interface Documents {
    _id?: ObjectId | string;
    case: undefined;
  documentType: string;
  fileUrl: string;
  fileName: string;
  mimeType?: string;
  fileSize?: number;
  createdBy: undefined;
  signatures?: any[];
  isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface DocumentsDocument extends Omit<Documents, "_id">, Document, SoftDeleteFields {}
