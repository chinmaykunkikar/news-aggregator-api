const jwt = require("jsonwebtoken");

const { readUsers } = require("../utils/usersFile.util");
const { JWT_SECRET } = require("../configs/env.config");
const {
  ERR_TOKEN_VERIFICATION,
  ERR_MISSING_AUTH_HEADER,
} = require("../constants/app.constants");

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: ERR_MISSING_AUTH_HEADER });
  }
  const accessToken = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    const users = readUsers();
    req.user = users.find((user) => user.username === decoded.username);
    if (!req.user) {
      return res.status(401).json({ error: ERR_TOKEN_VERIFICATION });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: ERR_TOKEN_VERIFICATION });
  }
};
