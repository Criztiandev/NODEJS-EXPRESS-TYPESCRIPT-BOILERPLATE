import { Schema, model, Query } from "mongoose";
import { DocumentsDocument } from "../feature/documents/interface/documents.interface";

const documentsSchema = new Schema(
  {
    case: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    documentType: {
      type: String,
      required: true,
      enum: [
        "complaint",
        "summons",
        "settlement",
        "certification",
        "resolution",
      ],
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: false,
    },
    fileSize: {
      type: Number,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    signatures: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        signedAt: Date,
        signatureUrl: String,
      },
    ],
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
