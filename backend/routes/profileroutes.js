const express = require("express");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// GET LOGGED-IN USER PROFILE
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || "",
        location: user.location || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error("Profile Error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// UPDATE LOGGED-IN USER PROFILE
router.put("/", authMiddleware, async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      location,
      linkedin,
      github,
    } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        message: "Full name and email are required",
      });
    }

    // Check if another account already uses this email
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
      _id: { $ne: req.userId },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || "",
        location: location?.trim() || "",
        linkedin: linkedin?.trim() || "",
        github: github?.trim() || "",
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone || "",
        location: updatedUser.location || "",
        linkedin: updatedUser.linkedin || "",
        github: updatedUser.github || "",
      },
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});


module.exports = router;