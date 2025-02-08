import mongoose, { ObjectId, Query } from "mongoose";
import { UserDocument } from "./user.model";

export interface Case {
  _id?: ObjectId | string;
  title: string;
  caseNumber: string;
  type: string;
  complinant: string;
  defendant: string;
  description: string;
  status: string;
  createdBy: string;
  updatedBy: string;
}

const caseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    caseNumber: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    complinant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    defendant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

caseSchema.pre(/^find/, function (this: Query<any, UserDocument>, next) {
  const conditions = this.getFilter();
  if (!("isDeleted" in conditions)) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model("Case", caseSchema);
