import { Schema, model } from "mongoose";
import { CaseDocument } from "../feature/case/interface/case.interface";

const populateConfig = [
  {
    path: "complainants.residents",
    select: "firstName lastName middleName fullAddress email phoneNumber",
  },
  {
    path: "respondents.residents",
    select: "firstName lastName middleName fullAddress email phoneNumber",
  },
  {
    path: "witnesses.residents",
    select: "firstName lastName middleName fullAddress email phoneNumber",
  },
  {
    path: "mediationDetails.mediator",
    select: "user position barangay",
  },
];

// Define party sub-schema
const partySchema = new Schema({
  residents: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ["active", "withdrawn", "resolved"],
    default: "active",
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
  withdrawalDate: {
    type: Date,
    required: false,
    default: null,
  },
  remarks: {
    type: String,
    required: false,
  },
});

// Main case schema
const caseSchema = new Schema(
  {
    caseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    // Complainants (can be multiple)
    complainants: [partySchema],

    // Respondents (can be multiple)
    respondents: [partySchema],

    // Witnesses (optional)
    witnesses: [partySchema],

    natureOfDispute: {
      type: String,
      required: true,
    },

    disputeDetails: {
      description: {
        type: String,
        required: true,
      },
      incidentDate: {
        type: Date,
        required: true,
      },

      location: {
        type: String,
        required: false,
        default: null,
      },
    },

    // Mediation tracking
    mediationDetails: {
      mediator: {
        type: Schema.Types.ObjectId,
        ref: "Officials",
      },
      scheduledDate: Date,
      status: {
        type: String,
        enum: ["scheduled", "completed", "cancelled", "rescheduled"],
        default: "scheduled",
      },
      remarks: String,
    },

    // For tracking case progress
    timeline: [
      {
        action: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        actor: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        remarks: String,
      },
    ],

    resolution: {
      date: {
        type: Date,
        required: false,
        default: null,
      },
      type: {
        type: String,
        enum: ["settled", "withdrawn", "escalated"],
        required: false,
        default: null,
      },
      details: {
        type: String,
        required: false,
        default: null,
      },
      attachments: [String],
    },

    // Case status and details
    status: {
      type: String,
      required: true,
      enum: ["filed", "under_mediation", "resolved", "escalated", "withdrawn"],
      default: "filed",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Middleware to update timeline on party status changes
caseSchema.pre("save", function (next) {
  const modifiedPaths = this.modifiedPaths();

  // Check if any party's status has changed
  ["complainants", "respondents", "witnesses"].forEach((partyType) => {
    if (modifiedPaths.includes(`${partyType}.$.status`)) {
      this.timeline.push({
        action: `${partyType.slice(0, -1)}_status_changed`,
        date: new Date(),
        remarks: `${partyType} status updated to ${this.get(
          `${partyType}.$.status`
        )}`,
      });
    }
  });

  next();
});

// Single middleware for all query types
caseSchema.pre(["find", "findOne"], function (next) {
  this.populate(populateConfig);
  next();
});

// Indexes for common queries
caseSchema.index({ caseNumber: 1 });
caseSchema.index({ "complainants.user": 1 });
caseSchema.index({ "respondents.user": 1 });
caseSchema.index({ status: 1, createdAt: -1 });

export default model<CaseDocument>("Case", caseSchema);
