const Ajv = require("ajv");
const betterAjvErrors = require("better-ajv-errors").default;
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const { readUsers, writeUsers } = require("../utils/usersFile.util");
const usersSchema = require("../schemas/users.schema");
const preferencesSchema = require("../schemas/preferences.schema");

const ajv = new Ajv({ useDefaults: true });
dotenv.config();

const validatePreferences = ajv.compile(preferencesSchema);
const validateUsers = ajv.compile(usersSchema);

function generateAccessToken(username) {
  return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: 86400 });
}

const register = (req, res) => {
  const validBody = validateUsers(req.body);
  const { id, username, password, preferences } = req.body;
  if (validBody) {
    const users = readUsers();
    const passHash = bcrypt.hashSync(password, 8);
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
    } else {
      const newUser = {
        id,
        username,
        password: passHash,
        preferences,
      };
      users.push(newUser);
      writeUsers(users);
      return res.status(201).json({ message: "Registered successfully" });
    }
  } else {
    // console.log(betterAjvErrors(usersSchema, req.body, validateUsers.errors));
    return res.status(400).json({ message: "Invalid data" });
  }
};

const login = (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const existingUser = users.find((user) => user.username === username);
  if (!existingUser) {
    return res.status(401).json({ message: "Username not found" });
  } else {
    const comparePass = bcrypt.compareSync(password, existingUser.password);
    if (!comparePass) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = generateAccessToken(username);
    return res.status(200).json({ message: "Login successful", token });
  }
};

module.exports = { login, register };
