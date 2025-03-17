import { Document, ObjectId } from "mongoose";
import { SoftDeleteFields } from "../../../core/base/repository/base.repository";

export interface Barangay {
  _id?: ObjectId | string;
  name: string;
  municipality: string;
  province: string;
  contactInfo: {
    phone?: string;
    email?: string;
    emergencyContact?: string;
  };
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BarangayDocument
  extends Omit<Barangay, "_id">,
    Document,
    SoftDeleteFields {}
