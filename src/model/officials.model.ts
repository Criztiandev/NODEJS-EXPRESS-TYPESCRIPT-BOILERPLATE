import { Schema, model } from "mongoose";
import { OfficialsDocument } from "../feature/officials/interface/officials.interface";

const populateConfig = [
  {
    path: "user",
    select: "firstName lastName middleName fullAddress email phoneNumber",
  },
  {
    path: "barangay",
    select: "name municipality province contactInfo",
  },
];

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

officialsSchema.pre(["find", "findOne"], function (next) {
  this.populate(populateConfig);
  next();
});

export default model<OfficialsDocument>("Officials", officialsSchema);
