const express = require("express");
const router = express.Router();
const { createSchedule, approveSchedule, getPending } = require("../Controller/checkupController");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const { listPendingConsent, respondConsent } = require("../Controller/consentController");
const { getAttendanceList, markAttendance } = require("../Controller/attendanceController");
const authenticateToken = require("../middlewares/authMiddlewares");

// Nurse tạo lịch
router.post("/", authenticateToken, createSchedule);

// Manager duyệt lịch
router.get("/pending", getPending);
router.post("/approve/:id", approveSchedule);

// Parent xác nhận
router.get("/consent", listPendingConsent);
router.post("/consent/:form_id/respond", respondConsent);

// Nurse điểm danh
router.get("/:schedule_id/attendance", getAttendanceList);
router.post("/:schedule_id/attendance", markAttendance);

module.exports = router;
