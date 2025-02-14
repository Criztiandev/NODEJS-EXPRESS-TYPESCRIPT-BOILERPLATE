import { Schema, model, Query } from "mongoose";
import { AuditDocument } from "../feature/audit/interface/audit.interface";

const auditSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    changes: {
      before: {
        type: Schema.Types.Mixed,
        required: false,
      },
      after: {
        type: Schema.Types.Mixed,
        required: false,
      },
    },
    ipAddress: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
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
auditSchema.pre(/^find/, function (this: Query<any, AuditDocument>, next) {
  const conditions = this.getFilter();
  if (!("isDeleted" in conditions)) {
    this.where({ isDeleted: false });
  }
  next();
});

export default model<AuditDocument>("Audit", auditSchema);
