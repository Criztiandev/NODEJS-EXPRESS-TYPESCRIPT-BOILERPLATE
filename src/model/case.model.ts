import mongoose, { ObjectId, Query, Schema } from "mongoose";

export interface Case {
  _id?: ObjectId | string;
  caseNumber: string;
  complainant: ObjectId | string;
  respondent: ObjectId | string;
  caseType: string;
  description: string;
  filingDate: Date;
  status: string;
  filingFee: number;
  assignedMediator: ObjectId | string;
  mediationSessions: {
    mediator: ObjectId | string;
    scheduleDate: Date;
    actualDate: Date;
    status: string;
    notes: string;
    outcome: string;
  };
  conciliationProceedings: {
    pangkatMembers: ObjectId | string[];
    scheduleDate: Date;
    actualDate: Date;
    status: string;
    notes: string;
    outcome: string;
  };
  settlement: {
    type: string;
    settlementDate: Date;
    terms: string;
    isAmicable: boolean;
    repudiationDeadline: Date;
    executionDate: Date;
  };
  documents: {
    documentType: string;
    fileName: string;
    filePath: string;
    uploadDate: Date;
    uploadedBy: ObjectId | string;
  };
  isDeleted: boolean;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const caseSchema = new Schema(
  {
    caseNumber: {
      type: String,
      unique: true,
      required: true,
    },
    complainant: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },
    respondent: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },
    caseType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    filingDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: [
        "FILED",
        "MEDIATION",
        "CONCILIATION",
        "SETTLED",
        "UNSETTLED",
        "ARCHIVED",
      ],
      default: "FILED",
    },
    filingFee: {
      type: Number,
      required: true,
    },
    assignedMediator: {
      type: Schema.Types.ObjectId,
      ref: "Person",
    },
    mediationSessions: [
      {
        mediator: {
          type: Schema.Types.ObjectId,
          ref: "Person",
        },
        scheduleDate: Date,
        actualDate: Date,
        status: {
          type: String,
          enum: ["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"],
        },
        notes: String,
        outcome: String,
      },
    ],
    conciliationProceedings: [
      {
        pangkatMembers: [
          {
            type: Schema.Types.ObjectId,
            ref: "Person",
          },
        ],
        scheduleDate: Date,
        actualDate: Date,
        status: {
          type: String,
          enum: ["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"],
        },
        notes: String,
        outcome: String,
      },
    ],
    settlement: {
      type: {
        type: String,
        enum: ["MEDIATED", "CONCILIATED"],
      },
      settlementDate: Date,
      terms: String,
      isAmicable: {
        type: Boolean,
        default: true,
      },
      repudiationDeadline: Date,
      executionDate: Date,
    },
    documents: [
      {
        documentType: {
          type: String,
          enum: [
            "KP7",
            "KP8",
            "KP9",
            "KP10",
            "KP11",
            "KP12",
            "KP13",
            "KP14",
            "KP20A",
            "OTHER",
          ],
        },
        fileName: String,
        filePath: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
        uploadedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

caseSchema.pre(/^find/, function (this: Query<any, Document>, next) {
  const conditions = this.getFilter();
  if (!("isDeleted" in conditions)) {
    this.where({ isDeleted: false });
  }
  next();
});

// Indexes
caseSchema.index({ caseNumber: 1 });
caseSchema.index({ complainant: 1 });
caseSchema.index({ respondent: 1 });
caseSchema.index({ status: 1 });
caseSchema.index({ filingDate: 1 });

// Pre-save middleware for settlement
caseSchema.pre("save", function (next) {
  if (
    this.settlement &&
    this.settlement.settlementDate &&
    !this.settlement.repudiationDeadline
  ) {
    const repudiationDate = new Date(this.settlement.settlementDate);
    repudiationDate.setDate(repudiationDate.getDate() + 10);
    this.settlement.repudiationDeadline = repudiationDate;
  }
  next();
});

export default mongoose.model("Case", caseSchema);
