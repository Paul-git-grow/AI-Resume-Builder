const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "Untitled Resume",
    },

    personalData: {
      type: Object,
      default: {},
    },

    educationData: {
      type: Object,
      default: {},
    },

    resumeData: {
      type: Object,
      default: {},
    },

    aiSummary: {
      type: String,
      default: "",
    },

    selectedTemplate: {
      type: String,
      default: "",
    },

    isEdited: {
  type: Boolean,
  default: false,
},

downloadCount: {
  type: Number,
  default: 0,
},
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;