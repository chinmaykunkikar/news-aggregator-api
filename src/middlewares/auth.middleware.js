const jwt = require("jsonwebtoken");

const { readUsers } = require("../utils/usersFile.util");
const { JWT_SECRET } = require("../config");

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Auth header not found" });
  }
  const accessToken = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    const users = readUsers();
    req.user = users.find((user) => user.username === decoded.username);
    if (!req.user) {
      return res.status(401).json({ error: "Cannot verify your token" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Cannot verify your token" });
  }
};
