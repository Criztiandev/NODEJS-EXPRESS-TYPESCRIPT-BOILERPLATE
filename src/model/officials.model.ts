import { Schema, model, Query } from "mongoose";
import { OfficialsDocument } from "../feature/officials/interface/officials.interface";

const officialsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    barangay: {
      type: Schema.Types.ObjectId,
      ref: "Barangay",
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    termStart: {
      type: Date,
      required: true,
    },
    termEnd: {
      type: Date,
      required: true,
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
officialsSchema.pre(
  /^find/,
  function (this: Query<any, OfficialsDocument>, next) {
    const conditions = this.getFilter();
    if (!("isDeleted" in conditions)) {
      this.where({ isDeleted: false });
    }
    next();
  }
);

export default model<OfficialsDocument>("Officials", officialsSchema);
