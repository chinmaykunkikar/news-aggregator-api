const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");

const ajv = new Ajv();

const usersFile = path.join(__dirname, "..", "users.json");

const userSchema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1 },
    username: { type: "string", minLength: 3 },
    password: { type: "string", minLength: 3 },
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

const register = (req, res) => {
  const validBody = ajv.validate(userSchema, req.body);
  const { id, username, password } = req.body;
  if (validBody) {
    const users = readUsers();
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
    } else {
      const newUser = { id, username, password };
      users.push(newUser);
      writeUsers(users);
      return res.status(201).json({ message: "User registered successfully." });
    }
  } else {
    return res.status(400).json({ message: "Invalid user data" });
  }
};

const login = (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  return res.status(200).json({ message: "boilerplate" });
};

module.exports = { login, register };
