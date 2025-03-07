import mongoose from "mongoose";

const CVSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please provide a title for your CV"],
    maxlength: [100, "Title cannot be more than 100 characters"],
    default: "My CV",
  },
  template: {
    type: String,
    required: true,
    enum: [
      "modern",
      "classic",
      "pro",
      "sherlock",
      "hr",
      "minimal",
      "teal",
      "simple-classic",
    ],
    default: "modern",
  },
  data: {
    type: Object,
    required: true,
    default: {
      personalInfo: {
        firstName: "",
        lastName: "",
        title: "",
        email: "",
        phone: "",
        address: "",
        postalCode: "",
        city: "",
        photo: "/placeholder-user.jpg",
      },
      profile: "",
      education: [],
      experience: [],
      skills: [],
      languages: [],
      interests: [],
    },
  },
  sectionOrder: {
    type: [String],
    default: [
      "personal-info",
      "profile",
      "education",
      "experience",
      "skills",
      "languages",
      "interests",
    ],
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

export default mongoose.models.CV || mongoose.model("CV", CVSchema);
