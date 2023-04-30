const express = require("express");
const newsRoutes = express.Router();

const verifyToken = require("../middleware/auth");
const { readUsers, writeUsers } = require("../helpers/usersFileFns");
newsRoutes.use(express.urlencoded({ extended: false }));
newsRoutes.use(express.json());

newsRoutes.get("/preferences", verifyToken, (req, res) => {
  res.json(req.user.preferences);
});

newsRoutes.put("/preferences", verifyToken, (req, res) => {
  try {
    const { preferences } = req.body;
    const { id } = req.user;
    let usersData = JSON.parse(JSON.stringify(readUsers()));
    const userIndex = usersData.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }
    usersData[userIndex].preferences = preferences;
    writeUsers(usersData);
    res.status(200).json({ message: "News preferences updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = newsRoutes;
