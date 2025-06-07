// Middleware kiểm tra user có vai trò được phép hay không
function authorize(allowedRoles = []) {
  return (req, res, next) => {
    const userRole = req.user.role; // Giả sử req.user đã chứa role do auth middleware trước đó gán
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied: insufficient permissions." });
    }
    next();
  };
}

module.exports = authorize;
