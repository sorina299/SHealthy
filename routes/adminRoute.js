const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/get-all-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error getting all doctors",
      success: false,
      error,
    });
  }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error getting all users",
      success: false,
      error,
    });
  }
});

router.post(
  "/change-doctor-account-status",
  authMiddleware,
  async (req, res) => {
    try {
      const { doctorId, status, userId } = req.body;
      const doctor = await Doctor.findByIdAndUpdate(doctorId, {
        status,
      });
      const user = await User.findOne({ _id: doctor.userId });
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: "new-doctor-request-changed",
        message: `Your doctor account has been ${status}`,

        onClickPath: "/notifications",
      });
      user.isDoctor = status === "approved" ? true : false;
      await user.save();
      res.status(200).send({
        message: "Doctor status changed successfully",
        success: true,
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Erro",
        success: false,
        error,
      });
    }
  }
);

router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Erro",
      success: false,
      error,
    });
  }
});

router.delete("/delete-user/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    res.status(200).send({
      message: "User deleted successfully",
      userId,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error deleting user",
      success: false,
      error,
    });
  }
});

module.exports = router;
