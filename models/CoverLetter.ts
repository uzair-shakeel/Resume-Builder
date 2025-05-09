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
    enum: [
      "modern",
      "classic",
      "professional",
      "minimal",
      "circulaire",
      "sherlock",
      "student",
      "hr",
      "teal",
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
        photo: "",
      },
      recipient: {
        description: "",
        name: "",
        company: "",
        address: "",
        postalCode: "",
        city: "",
      },
      dateAndSubject: {
        date: new Date().toLocaleDateString("fr-FR"),
        location: "",
        subject: "",
      },
      introduction: "",
      currentSituation: "",
      motivation: "",
      conclusion: "",
    },
  },
  sectionOrder: {
    type: Array,
    default: [
      "personal-info",
      "destinataire",
      "date-et-objet",
      "introduction",
      "situation-actuelle",
      "motivation",
      "conclusion",
    ],
  },
  sectionPages: {
    type: Object,
    default: {},
  },
  customSectionNames: {
    type: Object,
    default: {},
  },
  customSections: {
    type: Object,
    default: {},
  },
  accentColor: {
    type: String,
    default: "#3498db",
  },
  fontFamily: {
    type: String,
    default: "'DejaVu Sans', sans-serif",
  },
  preview: {
    type: String,
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

export default mongoose.models.CoverLetter ||
  mongoose.model("CoverLetter", CoverLetterSchema);
