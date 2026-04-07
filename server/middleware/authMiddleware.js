const jwt = require("jsonwebtoken");

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required.");
  }

  return process.env.JWT_SECRET;
}

function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

function adminProtect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Admin access denied." });
  }

  try {
    const jwtToken = authHeader.split(" ")[1];
    const decoded = jwt.verify(jwtToken, getJwtSecret());

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access denied." });
    }

    req.user = decoded;
    req.admin = true;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid admin token" });
  }
}

module.exports = { protect, adminProtect };
