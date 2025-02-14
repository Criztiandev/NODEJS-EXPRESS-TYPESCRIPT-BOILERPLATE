import { Schema, model, Query } from "mongoose";
import { SettlementDocument } from "../feature/settlement/interface/settlement.interface";

const settlementSchema = new Schema(
  {
    case: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    settlementDate: {
      type: Date,
      required: true,
    },
    settlementType: {
      type: String,
      enum: ["amicable", "mediated", "arbitrated"],
      required: true,
    },
    terms: {
      type: String,
      required: true,
    },
    isComplied: {
      type: Boolean,
      required: false,
    },
    complianceDate: {
      type: Date,
      required: false,
    },
    witnesses: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    mediator: {
      type: Schema.Types.ObjectId,
      ref: "official",
      required: true,
    },
    document: {
      type: Schema.Types.ObjectId,
      ref: "Document",
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
settlementSchema.pre(
  /^find/,
  function (this: Query<any, SettlementDocument>, next) {
    const conditions = this.getFilter();
    if (!("isDeleted" in conditions)) {
      this.where({ isDeleted: false });
    }
    next();
  }
);

export default model<SettlementDocument>("Settlement", settlementSchema);
