import { Schema, model, Query } from "mongoose";
import { DocumentsDocument } from "../feature/documents/interface/documents.interface";

const documentsSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
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
      ],
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
documentsSchema.pre(
  /^find/,
  function (this: Query<any, DocumentsDocument>, next) {
    const conditions = this.getFilter();
    if (!("isDeleted" in conditions)) {
      this.where({ isDeleted: false });
    }
    next();
  }
);

export default model<DocumentsDocument>("Documents", documentsSchema);
