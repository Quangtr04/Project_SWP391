const express = require("express");
const { getAllStudentInfo, getStudentInfoById } = require("../Controller/getInfomation");

const adminRouter = express.Router();

adminRouter.get("/InfomationStudent", async (req, res) => {
  try {
    const data = await getAllStudentInfo();
    res.status(200).json({ status: "success", Student: data });
  } catch (err) {
    res.status(401).json({ status: "fail", message: err });
  }
});

adminRouter.get("/InfomationStudent/:user_id", async (req, res) => {
  try {
    const { student_id } = req.params;
    const data = await getStudentInfoById(student_id);
    res.status(200).json({ status: "success", Student: data });
  } catch (err) {
    res.status(401).json({ status: "fail", message: err });
  }
});

module.exports = adminRouter;
