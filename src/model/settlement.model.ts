import { Schema, model } from "mongoose";
import { SettlementDocument } from "../feature/settlement/interface/settlement.interface";

const settlementSchema = new Schema(
  {
    case: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true,
    },

    // Settlement Type
    type: {
      type: String,
      required: true,
      enum: ["amicable", "mediated", "arbitrated"],
    },

    // Settlement Status
    status: {
      type: String,
      required: true,
      enum: ["pending", "complied", "non_complied", "repudiated"],
      default: "pending",
    },

    // Key Dates
    settlementDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // If there's a repudiation period
    repudiationDeadline: {
      type: Date,
      required: true, // 10 days from settlement date
    },

    complianceDeadline: {
      type: Date,
      required: true,
    },

    // Settlement Terms
    terms: {
      description: {
        type: String,
        required: true,
      },
      monetaryValue: {
        type: Number,
        required: false,
      },
      paymentSchedule: [
        {
          dueDate: Date,
          amount: Number,
          status: {
            type: String,
            enum: ["pending", "paid", "overdue"],
            default: "pending",
          },
          paidDate: Date,
        },
      ],
    },

    // Compliance Tracking
    compliance: {
      isComplied: {
        type: Boolean,
        default: false,
      },
      complianceDate: Date,
      nonComplianceReason: String,
      repudiationDate: Date,
      repudiationReason: String,
    },

    // Officials involved
    mediator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    witnesses: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Approval/Signatures
    signatures: {
      complainants: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          signedAt: Date,
          remarks: String,
        },
      ],
      respondents: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          signedAt: Date,
          remarks: String,
        },
      ],
      mediator: {
        signedAt: Date,
      },
    },

    // For enforcement if needed
    enforcement: {
      isEnforced: {
        type: Boolean,
        default: false,
      },
      enforcementDate: Date,
      enforcementType: {
        type: String,
        enum: ["voluntary", "execution"],
      },
      executionDetails: {
        motionDate: Date,
        hearingDate: Date,
        enforcementOfficer: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        remarks: String,
      },
    },

    // Attachments/Supporting documents
    attachments: [
      {
        fileName: String,
        fileType: String,
        fileUrl: String,
        uploadedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    remarks: String,

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

// Middleware to set repudiation deadline
settlementSchema.pre("save", function (next) {
  if (this.isNew) {
    // Set repudiation deadline to 10 days from settlement date
    const repudiationDate = new Date(this.settlementDate);
    repudiationDate.setDate(repudiationDate.getDate() + 10);
    this.repudiationDeadline = repudiationDate;
  }
  next();
});

// Methods
settlementSchema.methods = {
  // Mark settlement as complied
  async markComplied(complianceDate: Date, remarks?: string) {
    this.status = "complied";
    this.compliance.isComplied = true;
    this.compliance.complianceDate = complianceDate;
    if (remarks) this.remarks = remarks;
    return this.save();
  },

  // Handle repudiation
  async handleRepudiation(reason: string) {
    const now = new Date();
    if (now > this.repudiationDeadline) {
      throw new Error("Repudiation period has expired");
    }

    this.status = "repudiated";
    this.compliance.repudiationDate = now;
    this.compliance.repudiationReason = reason;
    return this.save();
  },

  // Update payment schedule
  async updatePayment(paymentIndex: number, status: string, paidDate?: Date) {
    if (paymentIndex >= 0 && paymentIndex < this.terms.paymentSchedule.length) {
      this.terms.paymentSchedule[paymentIndex].status = status;
      if (paidDate) {
        this.terms.paymentSchedule[paymentIndex].paidDate = paidDate;
      }
      return this.save();
    }
    throw new Error("Invalid payment index");
  },

  // Check if all parties have signed
  isFullySigned() {
    const allComplainantsSigned = this.signatures.complainants.every(
      (s: any) => s.signedAt
    );
    const allRespondentsSigned = this.signatures.respondents.every(
      (s: any) => s.signedAt
    );
    return (
      allComplainantsSigned &&
      allRespondentsSigned &&
      this.signatures.mediator.signedAt
    );
  },
};

// Indexes
settlementSchema.index({ case: 1, status: 1 });
settlementSchema.index({ "signatures.complainants.user": 1 });
settlementSchema.index({ "signatures.respondents.user": 1 });
settlementSchema.index({ mediator: 1 });

export default model<SettlementDocument>("Settlement", settlementSchema);
