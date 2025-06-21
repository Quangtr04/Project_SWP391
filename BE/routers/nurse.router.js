const express = require("express");
const { createSchedule, deleteSchedule } = require("../Controller/CheckUp/checkupController");

const { saveCheckupResult, updateCheckupNote } = require("../Controller/CheckUp/saveCheckupResult");

const authenticateToken = require("../middlewares/authMiddlewares");
const validateInput = require("../Utils/validateInput");
const Schemas = require("../Schemas/Schemas");
const {
  getCheckupListApproved,
  getCheckupApprovedById,
  getCheckupList,
  getCheckupListDeclined,
  getCheckupDeclinedById,
  getCheckupById,
} = require("../Controller/CheckUp/getCheckup");
const { getNotifications } = require("../Controller/Notification/getNotification");

const nurseRouter = express.Router();

// 📌 Tạo lịch khám sức khỏe (nurse)
nurseRouter.post("/checkups/create", authenticateToken, createSchedule);

// 📌 Xem danh sách tất cả lịch khám
nurseRouter.get("/checkups", getCheckupList);

// 📌 Xem chi tiết một lịch khám theo ID
nurseRouter.get("/checkups/:id", getCheckupById);

// 📌 Xóa một lịch khám theo ID
nurseRouter.delete("/checkups/:id", deleteSchedule);

// 📌 Lưu kết quả khám sức khỏe cho học sinh
nurseRouter.post(
  "/checkups/:checkup_id/students/:student_id/result",
  validateInput(Schemas, "Checkup_Result"),
  saveCheckupResult
);

// 📌 Cập nhật ghi chú (note) cho học sinh trong lịch khám
nurseRouter.patch("/checkups/:checkup_id/students/:student_id/note", updateCheckupNote);

// Lấy lịch khám đã được duyệt (để thực hiện khám)
nurseRouter.get("/checkups-approved", getCheckupListApproved);

// Lấy chi tiết một lịch khám đã được duyệt
nurseRouter.get("/checkups-approved/:id", getCheckupApprovedById);

// Lấy lịch khám bị từ chối
nurseRouter.get("/checkups-declined", getCheckupListDeclined);
nurseRouter.get("/checkups-declined/:id", getCheckupDeclinedById);

//lấy thông báo
nurseRouter.get("/notifications", authenticateToken, getNotifications);

module.exports = nurseRouter;
