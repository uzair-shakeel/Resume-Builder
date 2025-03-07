import mongoose from "mongoose";

const CoverLetterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please provide a title for your cover letter"],
    maxlength: [100, "Title cannot be more than 100 characters"],
    default: "My Cover Letter",
  },
  template: {
    type: String,
    required: true,
    enum: ["modern", "classic", "professional", "creative", "simple"],
    default: "modern",
  },
  data: {
    type: Object,
    required: true,
    default: {
      recipient: {
        name: "",
        company: "",
        address: "",
        city: "",
        postalCode: "",
        email: "",
      },
      sender: {
        name: "",
        address: "",
        city: "",
        postalCode: "",
        email: "",
        phone: "",
      },
      subject: "",
      greeting: "",
      introduction: "",
      body: "",
      conclusion: "",
      signature: "",
      date: new Date().toISOString().split("T")[0],
    },
  },
  accentColor: {
    type: String,
    default: "#3498db",
  },
  fontFamily: {
    type: String,
    default: "'DejaVu Sans', sans-serif",
  },
  lastEdited: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.CoverLetter ||
  mongoose.model("CoverLetter", CoverLetterSchema);
