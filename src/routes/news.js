const axios = require("axios");
const dotenv = require("dotenv");
const express = require("express");
const newsRoutes = express.Router();

const verifyToken = require("../middleware/auth");
const { readUsers, writeUsers } = require("../helpers/usersFileFns");

newsRoutes.use(express.urlencoded({ extended: false }));
newsRoutes.use(express.json());
dotenv.config();

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

newsRoutes.get("/", verifyToken, async (req, res) => {
  const { type } = req.query;
  const { id, preferences } = req.user;
  let usersData = JSON.parse(JSON.stringify(readUsers()));
  const userIndex = usersData.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    const sources = preferences.sources.join(",");
    const categories = preferences.categories.join(",");
    let newsResponse;
    if (type.toLowerCase() === "top") {
      newsResponse = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=${categories}&apiKey=${process.env.NEWSAPI_KEY}`
      );
    } else {
      newsResponse = await axios.get(
        `https://newsapi.org/v2/everything?sources=${sources}&apiKey=${process.env.NEWSAPI_KEY}`
      );
    }
    const articles = newsResponse.data.articles;
    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = newsRoutes;
