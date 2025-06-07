const sql = require("mssql");
const sqlServerPool = require("../Utils/connectMySql");
const getRole = require("../Utils/getRole");

const getParentInfo = async () => {
  try {
    const pool = await sqlServerPool;
    const result = await pool.request().query("SELECT * FROM [Infomation] WHERE user_id = 4");
    if (result.recordset.length > 0) {
      return result.recordset[0];
    }
  } catch (error) {
    console.error("Failed to get infomation parent:", error.message);
    throw new Error("Failed to get infomation parent: " + error.message);
  }
};

const getAllStudentInfo = async () => {
  try {
    const pool = await sqlServerPool;
    const result = await pool.request().query("SELECT * FROM [SWP391].[dbo].[Student_Information]");
    return result.recordset.length > 0 ? result.recordset : [];
  } catch (error) {
    console.log("Error message: " + error.message);
    throw new Error("Failed to get all student info" + error.message);
  }
};

const getStudentInfoById = async (student_id) => {
  try {
    const pool = await sqlServerPool;
    const result = await pool
      .request()
      .input("student_id", sql.Int, student_id)
      .query("SELECT * FROM [SWP391].[dbo].[Student_Information] WHERE student_info_id = @student_id");
    return result.recordset.length > 0 ? result.recordset : [];
  } catch (error) {
    console.log("Error message: " + error.message);
    throw new Error("Failed to get all student info" + error.message);
  }
};

module.exports = {
  getParentInfo,
  getAllStudentInfo,
  getStudentInfoById,
};
