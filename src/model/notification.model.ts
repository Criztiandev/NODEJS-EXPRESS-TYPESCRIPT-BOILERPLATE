import { Schema, model, Query } from "mongoose";
import { NotificationDocument } from "../feature/notification/interface/notification.interface";

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["hearing", "document", "settlement", "status", "system"],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedCase: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: false,
    },
    isRead: {
      type: Boolean,
      required: false,
      default: false,
    },
    readAt: {
      type: Date,
      required: false,
    },
    deliveryMethod: {
      type: String,
      required: true,
      enum: ["sms", "email", "inApp"],
    },
    deliveryStatus: {
      type: String,
      required: false,
      enum: ["pending", "sent", "delivered", "failed"],
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
notificationSchema.pre(
  /^find/,
  function (this: Query<any, NotificationDocument>, next) {
    const conditions = this.getFilter();
    if (!("isDeleted" in conditions)) {
      this.where({ isDeleted: false });
    }
    next();
  }
);

export default model<NotificationDocument>("Notification", notificationSchema);
