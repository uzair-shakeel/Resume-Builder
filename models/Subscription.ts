import mongoose, { Schema, Document } from "mongoose";

export interface SubscriptionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  plan: "monthly" | "quarterly" | "yearly" | "trial";
  type: "cv" | "cover-letter" | "all";
  startDate: Date;
  endDate: Date;
  amount: number;
  currency: string;
  status: "active" | "expired" | "canceled";
  paymentReference: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<SubscriptionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      enum: ["monthly", "quarterly", "yearly", "trial"],
      required: true,
    },
    type: {
      type: String,
      enum: ["cv", "cover-letter", "all"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "XOF",
    },
    status: {
      type: String,
      enum: ["active", "expired", "canceled"],
      default: "active",
    },
    paymentReference: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ email: 1 });
SubscriptionSchema.index({ paymentReference: 1 });
SubscriptionSchema.index({ endDate: 1 });

export default mongoose.models.Subscription ||
  mongoose.model<SubscriptionDocument>("Subscription", SubscriptionSchema);
