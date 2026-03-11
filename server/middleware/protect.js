const jwt = require("jsonwebtoken");

function protect(req, res, next) {
  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const userData = jwt.verify(token, process.env.JWTPRIVATEKEY);
    req.user = userData;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = protect;
