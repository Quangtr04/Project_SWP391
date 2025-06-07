const sql = require("mssql");
const sqlServerPool = require("../Utils/connectMySql");
const getRole = require("../Utils/getRole");

const getParentInfo = async () => {
  try {
    const pool = await sqlServerPool;
    const result = await pool.request().query("SELECT * FROM [Infomation] WHERE user_id = @user_id");
    if (result.recordset.length > 0) {
      return result.recordset[0];
    }
  } catch (error) {
    console.error("Failed to get infomation parent:", error.message);
    throw new Error("Failed to get infomation parent: " + error.message);
  }
};

const getAllStudentByParentId = async (user_id) => {
  try {
    const pool = await sqlServerPool;
    const result = await pool
      .request()
      .input("user_id", sql.Int, user_id)
      .query(
        "SELECT s.student_info_id, s.full_name FROM [SWP391].[dbo].[Student_Information] s JOIN [SWP391].[dbo].[Infomation] i ON s.parent_id = i.user_id WHERE i.user_id = @user_id"
      );
    return result.recordset.length > 0 ? result.recordset : [];
  } catch (error) {
    console.log("Error message: " + error.message);
    throw new Error("Failed to get student info by parentId" + error.message);
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
    const result = await pool.request().input("student_id", sql.Int, student_id).query(`
        SELECT [student_info_id],
               [student_code],
               [full_name],
               [gender],
               [date_of_birth],
               [class_name],
               [parent_id],
               [address] FROM [SWP391].[dbo].[Student_Information] WHERE student_info_id = @student_id`);
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
  getAllStudentByParentId,
};
