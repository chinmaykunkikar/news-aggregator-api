const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "..", "users.json");

function readUsers() {
  const data = fs.readFileSync(usersFile);
  return JSON.parse(data);
}

function writeUsers(user) {
  const data = JSON.stringify(user);
  return fs.writeFileSync(usersFile, data);
}

const register = (req, res) => {
  const { id, username, password } = req.body;
  const users = readUsers();
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) res.status(400).json({ message: "User already exists" });
  const newUser = { id, username, password };
  users.push(newUser);
  writeUsers(users);
  return res.status(201).json({ message: "User registered successfully." });
};

const login = (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  return res.status(200).json({ message: "boilerplate" });
};

module.exports = { login, register };
