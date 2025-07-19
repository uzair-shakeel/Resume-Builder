import mongoose from "mongoose";

export interface IPayment {
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: string;
  source: string; // e.g., "Monthly Plan", "Quarterly Plan", "Annual Plan"
  paymentDate: Date;
  description: string;
  paymentMethod: string;
  transactionId: string;
}

const PaymentSchema = new mongoose.Schema<IPayment>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount cannot be negative"],
  },
  currency: {
    type: String,
    required: [true, "Currency is required"],
    default: "XOF",
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "completed",
  },
  source: {
    type: String,
    required: [true, "Payment source is required"],
    enum: ["Monthly Plan", "Quarterly Plan", "Annual Plan", "14-Hour Plan"],
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    default: "",
  },
  paymentMethod: {
    type: String,
    default: "credit_card",
  },
  transactionId: {
    type: String,
    default: "",
  },
});

// Create a compound index to ensure we don't duplicate transaction IDs
PaymentSchema.index({ transactionId: 1 }, { unique: true, sparse: true });

export default mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", PaymentSchema);
