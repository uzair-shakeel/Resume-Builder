import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
  documentType: {
    type: String,
    enum: ["CV", "CoverLetter"],
    required: true,
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "documentType",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    enum: ["download", "view", "create", "edit"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: Object,
    default: {},
  },
});

// Create compound index for efficient querying
AnalyticsSchema.index({ documentType: 1, action: 1 });
AnalyticsSchema.index({ userId: 1, action: 1 });

export default mongoose.models.Analytics ||
  mongoose.model("Analytics", AnalyticsSchema);
