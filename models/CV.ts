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
  preview: {
    type: String,
    required: false,
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
      "circulaire",
      "student",
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
      references: [],
      socials: [],
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
  sectionPages: {
    type: Map,
    of: Number,
    default: {},
  },
  customSectionNames: {
    type: Map,
    of: String,
    default: {},
  },
  // Download tracking fields
  isDownloaded: {
    type: Boolean,
    default: false,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  lastDownloadedAt: {
    type: Date,
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
