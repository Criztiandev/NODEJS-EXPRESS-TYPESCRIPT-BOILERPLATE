import { Schema, model } from "mongoose";
import { HearingDocument } from "../feature/hearing/interface/hearing.interface";

const hearingSchema = new Schema(
  {
    case: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true,
    },

    // Hearing Type
    type: {
      type: String,
      required: true,
      enum: ["mediation", "conciliation", "arbitration"],
    },

    // Hearing Status
    status: {
      type: String,
      required: true,
      enum: [
        "scheduled", // Scheduled but not yet held
        "ongoing", // Currently in progress
        "completed", // Completed successfully
        "cancelled", // Cancelled before occurrence
        "rescheduled", // Rescheduled to a new date
        "no_show", // No show by any party
      ],
      default: "scheduled",
    },

    // Schedule Information
    schedule: {
      date: {
        type: Date,
        required: true,
      },
      startTime: {
        type: Date,
        required: true,
      },
      endTime: {
        type: Date,
        required: true,
      },
      venue: {
        type: String,
        required: true,
      },
    },

    // If rescheduled
    rescheduledFrom: {
      originalDate: Date,
      reason: String,
    },

    // Attendance tracking
    attendance: {
      complainants: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          status: {
            type: String,
            enum: ["present", "absent", "late"],
            required: true,
          },
          arrivalTime: Date,
          remarks: { type: String, required: false },
        },
      ],
      respondents: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          status: {
            type: String,
            enum: ["present", "absent", "late"],
            required: true,
          },
          arrivalTime: Date,
          remarks: { type: String, required: false },
        },
      ],
      witnesses: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          status: {
            type: String,
            enum: ["present", "absent", "late"],
            required: true,
          },
          arrivalTime: Date,
          remarks: String,
        },
      ],
    },

    // Officials present
    officials: {
      mediator: {
        user: {
          type: Schema.Types.ObjectId,
          ref: "Officials",
          required: true,
        },
        remarks: String,
      },
      pangkatMembers: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "Officials",
          },
          role: String,
          remarks: String,
        },
      ],
    },

    // Proceedings
    proceedings: {
      summary: String,
      agreements: [
        {
          description: String,
          agreedBy: [
            {
              resident: {
                type: Schema.Types.ObjectId,
                ref: "User",
              },
              party: {
                type: String,
                enum: ["complainant", "respondent"],
              },
            },
          ],
        },
      ],
      nextSteps: String,
      recommendations: String,
    },

    // Outcome
    outcome: {
      result: {
        type: String,
        enum: ["settled", "not_settled", "for_followup", "escalated"],
      },
      settlementReached: Boolean,
      reasonIfNotSettled: String,
      nextHearingNeeded: Boolean,
      nextHearingDate: Date,
    },

    // Attachments (minutes, evidence, etc.)
    attachments: [
      {
        type: {
          type: String,
          enum: ["minutes", "evidence", "agreement", "other"],
        },
        fileName: String,
        fileUrl: String,
        uploadedBy: {
          type: Schema.Types.ObjectId,
          ref: "Officials",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // General remarks
    remarks: String,

    // For soft delete
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

// Indexes for common queries
hearingSchema.index({ "schedule.date": 1, status: 1 });
hearingSchema.index({ case: 1, type: 1 });
hearingSchema.index({ "officials.mediator.user": 1 });

// Methods
hearingSchema.methods = {
  // Mark attendance for a party
  async markAttendance(
    partyType: string,
    userId: string,
    status: string,
    arrivalTime?: Date
  ) {
    const attendance = this.attendance[partyType].find(
      (a: any) => a.user.toString() === userId
    );

    if (attendance) {
      attendance.status = status;
      attendance.arrivalTime = arrivalTime || new Date();
      return this.save();
    }
    throw new Error("Party not found in hearing");
  },

  // Reschedule hearing
  async reschedule(newDate: Date, reason: string) {
    const oldDate = this.schedule.date;
    this.rescheduledFrom = {
      originalDate: oldDate,
      reason,
    };
    this.schedule.date = newDate;
    this.status = "rescheduled";
    return this.save();
  },

  // Record hearing outcome
  async recordOutcome(outcomeData: {
    result: string;
    settlementReached: boolean;
    reasonIfNotSettled?: string;
    nextHearingNeeded?: boolean;
    nextHearingDate?: Date;
  }) {
    this.outcome = outcomeData;
    this.status = "completed";
    return this.save();
  },

  // Check if all required parties are present
  isQuorumMet() {
    const complainantsPresent = this.attendance.complainants.some(
      (a: any) => a.status === "present" || a.status === "late"
    );
    const respondentsPresent = this.attendance.respondents.some(
      (a: any) => a.status === "present" || a.status === "late"
    );
    const mediatorPresent = this.officials.mediator !== null;

    return complainantsPresent && respondentsPresent && mediatorPresent;
  },

  // Add meeting minutes or other attachments
  async addAttachment(data: {
    type: string;
    fileName: string;
    fileUrl: string;
    uploadedBy: string;
  }) {
    this.attachments.push({
      ...data,
      uploadedAt: new Date(),
    });
    return this.save();
  },
};

export default model<HearingDocument>("Hearing", hearingSchema);
