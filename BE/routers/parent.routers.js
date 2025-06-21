const express = require("express");
const authenticateToken = require("../middlewares/authMiddlewares");
const validateInput = require("../Utils/validateInput");
const Schemas = require("../Schemas/Schemas");

const { getAllStudentByParentId, getStudentInfoById } = require("../Controller/getInfo/getInformation");

const { listPendingConsent, respondConsent } = require("../Controller/CheckUp/consentController");

const {
  healthDeclarationController,
  getHealthDeclarationOfStudentByParent,
} = require("../Controller/Health/healthDeclaration");

const { medicalSubmissionReq } = require("../Controller/Medical/medicalSubmissionReq");
const { UpdateStatusCheckupParent } = require("../Controller/CheckUp/UpdateStatusCheckup");
const { getNotifications } = require("../Controller/Notification/getNotification");

const parentRouter = express.Router();

/**
 * 🔍 Xem danh sách con cái của phụ huynh
 */
parentRouter.get("/students", authenticateToken, getAllStudentByParentId);

/**
 * 🔍 Xem thông tin chi tiết của 1 học sinh
 */
parentRouter.get("/students/:student_id", authenticateToken, getStudentInfoById);

/**
 * 📋 Danh sách phiếu đồng ý khám sức khỏe chưa phản hồi
 */
parentRouter.get("/consents/pending", authenticateToken, listPendingConsent);

/**
 * ✅ Phản hồi phiếu đồng ý khám sức khỏe (AGREED / DECLINED)
 */
parentRouter.post("/consents/:form_id/respond", authenticateToken, respondConsent);

/**
 * 📝 Phụ huynh cập nhật lại trạng thái đồng ý/từ chối cho 1 lịch khám cụ thể
 */
parentRouter.patch("/checkups/:checkup_id/consent", authenticateToken, UpdateStatusCheckupParent);

/**
 * 📄 Lấy thông tin khai báo y tế của học sinh
 */
parentRouter.get("/students/:student_id/health-declaration", authenticateToken, getHealthDeclarationOfStudentByParent);

/**
 * 📮 Gửi yêu cầu nộp hồ sơ y tế
 */
parentRouter.post(
  "/medical-submissions",
  authenticateToken,
  validateInput(Schemas, "MedicalSubmissionRequest"),
  medicalSubmissionReq
);

/**
 * 📝 Tạo khai báo y tế cho học sinh
 */
parentRouter.post(
  "/students/:studentId/health-declarations",
  authenticateToken,
  validateInput(Schemas, "HealthDeclaration"),
  healthDeclarationController
);

/**
 * 🔔 Lấy danh sách thông báo của phụ huynh (có phân trang)
 * /notifications?page=1&limit=10
 */
parentRouter.get("/notifications", authenticateToken, getNotifications);

module.exports = parentRouter;
