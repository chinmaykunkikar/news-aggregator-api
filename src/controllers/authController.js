const Ajv = require("ajv");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");

const ajv = new Ajv();
dotenv.config();

const usersFile = path.join(__dirname, "..", "users.json");

const userSchema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1 },
    username: { type: "string", minLength: 3 },
    password: { type: "string", minLength: 3 },
    preferences: {
      type: "object",
      sources: { type: "array" },
      categories: { type: "array" },
    },
  },
  required: ["id", "username", "password"],
  additionalProperties: false,
};

function readUsers() {
  const data = fs.readFileSync(usersFile);
  return JSON.parse(data);
}

function writeUsers(user) {
  const data = JSON.stringify(user);
  return fs.writeFileSync(usersFile, data);
}

function generateAccessToken(username) {
  return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: 86400 });
}

const register = (req, res) => {
  const validBody = ajv.validate(userSchema, req.body);
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
        preferences: preferences || [],
      };
      users.push(newUser);
      writeUsers(users);
      return res.status(201).json({ message: "Registered successfully" });
    }
  } else {
    return res.status(400).json({ message: "Invalid user data" });
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
