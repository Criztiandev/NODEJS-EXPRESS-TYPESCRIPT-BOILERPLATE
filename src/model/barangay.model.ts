import { Schema, model, Query } from "mongoose";
import { BarangayDocument } from "../feature/barangay/interface/barangay.interface";

const barangaySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    municipality: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    contactInfo: {
      phone: {
        type: String,
        required: false,
        unique: true,
      },
      email: {
        type: String,
        required: false,
        unique: true,
      },
      emergencyContact: {
        type: String,
        required: false,
        unique: true,
      },
    },
    isActive: {
      type: Boolean,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to exclude deleted documents by default
// barangaySchema.pre(
//   /^find/,
//   function (this: Query<any, BarangayDocument>, next) {
//     const conditions = this.getFilter();
//     if (!("isDeleted" in conditions)) {
//       this.where({ isDeleted: false });
//     }
//     next();
//   }
// );

export default model<BarangayDocument>("Barangay", barangaySchema);
