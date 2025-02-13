import { Schema, model, Query } from "mongoose";
import { Case, CaseDocument } from "../feature/case/interface/case.interface";

const caseSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      required: false
    },
    startDate: {
      type: Date,
      required: true
    },
    isDeleted: { 
      type: Boolean, 
      required: true,
      default: false 
    },
    deletedAt: { 
      type: Date, 
      required: false,
      default: null 
    }
  },
  { 
    timestamps: true,
  }
);

// Middleware to exclude deleted documents by default
caseSchema.pre(/^find/, function (this: Query<any, CaseDocument>, next) {
  const conditions = this.getFilter();
  if (!("isDeleted" in conditions)) {
    this.where({ isDeleted: false });
  }
  next();
});

export default model<CaseDocument>("Case", caseSchema);
