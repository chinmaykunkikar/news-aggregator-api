const Ajv = require("ajv").default;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const { readUsers, writeUsers } = require("../utils/usersFile.util");
const usersSchema = require("../schemas/users.schema");
const preferencesSchema = require("../schemas/preferences.schema");
const { JWT_SECRET } = require("../configs/env.config");
const {
  ERR_USER_EXISTS,
  ERR_VALIDATION,
  ERR_USER_NOT_FOUND,
  ERR_INVALID_PASSWORD,
  STATUS_ERROR,
  MSG_SUCCESSFUL_REGISTRATION,
  MSG_SUCCESSFUL_LOGIN,
} = require("../constants/app.constants");

const ajv = new Ajv({ useDefaults: true, allErrors: true });
require("ajv-errors")(ajv);

ajv.compile(preferencesSchema);
const validateUsers = ajv.compile(usersSchema);

function generateAccessToken(username) {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: 86400 });
}

const register = (req, res) => {
  const validBody = validateUsers(req.body);
  const { username, password, preferences } = req.body;
  const id = nanoid(5);
  if (validBody) {
    const users = readUsers();
    const passHash = bcrypt.hashSync(password, 8);
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      res.status(400).json({ error: ERR_USER_EXISTS });
    } else {
      const newUser = {
        id,
        username,
        password: passHash,
        preferences,
      };
      users.push(newUser);
      writeUsers(users);
      return res.status(201).json({ message: MSG_SUCCESSFUL_REGISTRATION });
    }
  } else {
    const errors = validateUsers.errors.map((error) => {
      const { message } = error;
      return { message };
    });
    return res
      .status(400)
      .json({ status: STATUS_ERROR, message: ERR_VALIDATION, errors });
  }
};

const login = (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const existingUser = users.find((user) => user.username === username);
  if (!existingUser) {
    return res.status(404).json({ error: ERR_USER_NOT_FOUND });
  } else {
    const comparePass = bcrypt.compareSync(password, existingUser.password);
    if (!comparePass) {
      return res.status(401).json({ error: ERR_INVALID_PASSWORD });
    }
    const accessToken = generateAccessToken(username);
    return res.status(200).json({ message: MSG_SUCCESSFUL_LOGIN, accessToken });
  }
};

module.exports = { login, register };
