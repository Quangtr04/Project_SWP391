const express = require("express");
const { getAllStudentByParentId, getStudentInfoById } = require("../Controller/getInfomation");

const parentRouter = express.Router();

parentRouter.get("/home/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await getAllStudentByParentId(user_id);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch {
    res.status(400).json({ status: "fail", message: err });
  }
});

parentRouter.get("/InformationStudent/:student_id", async (req, res) => {
  const { student_id } = req.params;
  try {
    const result = await getStudentInfoById(student_id);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch {
    res.status(400).json({ status: "fail", message: err });
  }
});

parentRouter.get("/viewProfile", async (req, res) => {});

module.exports = parentRouter;
