const express = require("express");
const Resume = require("../models/Resume");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ===============================
// CREATE RESUME
// POST /api/resumes
// ===============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      personalData,
      educationData,
      resumeData,
      aiSummary,
      selectedTemplate,
    } = req.body;

    const newResume = new Resume({
      userId: req.userId,
      title: title || "Untitled Resume",
      personalData: personalData || {},
      educationData: educationData || {},
      resumeData: resumeData || {},
      aiSummary: aiSummary || "",
      selectedTemplate: selectedTemplate || "",
    });

    const savedResume = await newResume.save();

    return res.status(201).json({
      message: "Resume saved successfully",
      resume: savedResume,
    });
  } catch (error) {
    console.error("Create Resume Error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// ===============================
// GET LOGGED-IN USER'S RESUMES
// GET /api/resumes
// ===============================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find({
      userId: req.userId,
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      resumes,
    });
  } catch (error) {
    console.error("Get Resumes Error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// ===============================
// INCREASE DOWNLOAD COUNT
// PUT /api/resumes/:id/download
// ===============================
router.put("/:id/download", authMiddleware, async (req, res) => {
  try {
    const updatedResume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      {
        $inc: { downloadCount: 1 },
      },
      {
        returnDocument: "after",
      }
    );

    if (!updatedResume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "Download count updated successfully",
      resume: updatedResume,
    });
  } catch (error) {
    console.error("Download Count Error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// ===============================
// UPDATE RESUME
// PUT /api/resumes/:id
// ===============================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      personalData,
      educationData,
      resumeData,
      aiSummary,
      selectedTemplate,
    } = req.body;

    const updatedResume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      {
        title,
        personalData,
        educationData,
        resumeData,
        aiSummary,
        selectedTemplate,
        isEdited: true,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedResume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "Resume updated successfully",
      resume: updatedResume,
    });
  } catch (error) {
    console.error("Update Resume Error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// ===============================
// DELETE RESUME
// DELETE /api/resumes/:id
// ===============================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedResume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deletedResume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete Resume Error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});


module.exports = router;