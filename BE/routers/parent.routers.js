const express = require("express");
const authenticateToken = require("../middlewares/authMiddlewares");
const validateInput = require("../Utils/validateInput");
const Schemas = require("../Schemas/Schemas");

// --- Import Controllers ---
// Thông tin học sinh
const { getAllStudentByParentId, getStudentInfoById } = require("../Controller/Infomation/getInformation");

// Khám sức khỏe / Đồng ý khám sức khỏe
const { listPendingConsent, respondConsent } = require("../Controller/CheckUp/consentController");
const { UpdateStatusCheckupParent } = require("../Controller/CheckUp/UpdateStatusCheckup");
const {
  getCheckupListApproved,
  getCheckupListByIdAndParentId,
  getCheckupListByParentId,
} = require("../Controller/CheckUp/getCheckup");

// Khai báo y tế
const {
  createHealthDeclarationById,
  getHealthDeclarationOfStudentById,
} = require("../Controller/Health/healthDeclaration");

// Sự cố y tế
const { getIncidentsByUserId, getIncidentById } = require("../Controller/Medical/medical_Incident");

// Yêu cầu gửi thuốc
const { medicationSubmissionReq } = require("../Controller/Medical/medicalSubmissionReq");

// Thông báo
const { getNotifications } = require("../Controller/Notification/getNotification");
const {
  getConsentVaccineByParentId,
  getConsentVaccineApproveByParentId,
  getConsentVaccineDeclineByParentId,
  getConsentVaccineByIdAndParentId,
  getResponseConsentVaccineParent,
} = require("../Controller/Vaccine/consentVaccineController");
const { UpdateResponseByParent } = require("../Controller/Vaccine/UpdateResponseVaccine");
const { getUserByUserId } = require("../Controller/Infomation/getUser");
const { parentUpdateUserById } = require("../Controller/Login/account_status");

const parentRouter = express.Router();

// --- Nhóm các API liên quan đến Học sinh (Students) ---
/**
 * 🔍 Xem danh sách con cái của phụ huynh
 */
parentRouter.get("/students", authenticateToken, getAllStudentByParentId); //done

// Lấy thông tin cá nhân
parentRouter.get("profile/:user_id", authenticateToken, getUserByUserId);

// Cập nhật thông tin
parentRouter.patch("/profile/:user_id", authenticateToken, parentUpdateUserById);

/**
 * 🔍 Xem thông tin chi tiết của 1 học sinh
 */
parentRouter.get("/students/:student_id", authenticateToken, getStudentInfoById); //done

// --- Nhóm các API liên quan đến Khám sức khỏe (Checkups) và Đồng ý khám sức khỏe (Consents) ---

/** * 📋 Danh sách phiếu đồng ý khám sức khỏe đã duyệt (hoặc danh sách phiếu khám sức khỏe đã duyệt)
 */
parentRouter.get("/checkups/approved", authenticateToken, getCheckupListByParentId); // Đổi từ /consents checkups/approved để thống nhất
parentRouter.get("/consents-checkups/approved", authenticateToken, getCheckupListApproved); // Giữ lại nếu cần cả hai, nếu không thì bỏ cái trùng lặp

/** * 📋 Chi tiết phiếu khám sức khỏe
 */
parentRouter.get("/consents-checkups/:id", authenticateToken, getCheckupListByIdAndParentId);

/**
 * 📋 Danh sách phiếu đồng ý khám sức khỏe chưa phản hồi
 */
parentRouter.get("/consents-checkups/pending", authenticateToken, listPendingConsent); //done

/**
 * ✅ Phản hồi phiếu đồng ý khám sức khỏe (AGREED / DECLINED)
 */
parentRouter.post("/consents-checkups/:form_id/respond", authenticateToken, respondConsent); //done

/**
 * 📝 Phụ huynh cập nhật lại trạng thái đồng ý/từ chối cho 1 lịch khám cụ thể
 */
parentRouter.patch("/checkups/:checkup_id/consent", authenticateToken, UpdateStatusCheckupParent); //done

// --- Nhóm các API liên quan đến Khai báo y tế (Health Declarations) ---
/**
 * 📄 Lấy thông tin khai báo y tế của học sinh
 */
parentRouter.get("/students/:student_id/health-declaration", authenticateToken, getHealthDeclarationOfStudentById);

/**
 * 📝 Tạo khai báo y tế cho học sinh
 */
parentRouter.post(
  "/students/:studentId/health-declarations",
  authenticateToken,
  validateInput(Schemas, "HealthDeclaration"),
  createHealthDeclarationById
);

// --- Nhóm các API liên quan đến Sự cố y tế (Medical Incidents) ---
// Lấy tất cả sự cố y tế liên quan đến một user
parentRouter.get("/incidents/:user_id", authenticateToken, getIncidentsByUserId);

// Lấy sự cố y tế của học sinh theo ID (Lưu ý: "view incedent" có vẻ là lỗi chính tả, nên đổi thành /:incident_id)
parentRouter.get("/incidents/:incident_id", authenticateToken, getIncidentById); // Thêm authenticateToken nếu cần, và đổi tên parameter cho rõ ràng

// --- Nhóm các API liên quan đến Yêu cầu gửi thuốc (Medical Submissions) ---
/**
 * 📮 Gửi yêu cầu gửi thuốc
 */
parentRouter.post(
  "/medical-submissions",
  authenticateToken,
  validateInput(Schemas, "MedicalSubmissionRequest"),
  medicationSubmissionReq
);

// Lấy tất cả lịch tiêm chủng về
parentRouter.get("/vaccine-campaigns", authenticateToken, getConsentVaccineByParentId);

// Lấy lịch tiêm chủng dựa trên id
parentRouter.get("/vaccine-campaigns/:id", authenticateToken, getConsentVaccineByIdAndParentId);

// Lấy tất cả lịch tiêm chủng đã được chấp thuận
parentRouter.get("/vaccine-campaigns/approved", authenticateToken, getConsentVaccineApproveByParentId);

// Lấy tất cả lịch tiêm chủng đã bị từ chối
parentRouter.get("/vaccine-campaigns/declined", authenticateToken, getConsentVaccineDeclineByParentId);

// Phản hồi về trạng thái lịch tiêm chủng
parentRouter.post("/vaccine-campaigns/:id/respond", authenticateToken, getResponseConsentVaccineParent);

// Cập nhật về trạng thái lịch tiêm chủng
parentRouter.patch("/vaccine-campaigns/:id/status", authenticateToken, UpdateResponseByParent);

// --- Nhóm các API liên quan đến Thông báo (Notifications) ---
/**
 * 🔔 Lấy danh sách thông báo của phụ huynh (có phân trang)
 * /notifications?page=1&limit=10
 */
parentRouter.get("/notifications", authenticateToken, getNotifications);

module.exports = parentRouter;
