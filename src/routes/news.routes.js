const Ajv = require("ajv");
const axios = require("axios");
const dotenv = require("dotenv");
const express = require("express");
const newsRoutes = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const { readUsers, writeUsers } = require("../utils/usersFile.utils");
const preferencesSchema = require("../schemas/preferences.schema");

newsRoutes.use(express.urlencoded({ extended: false }));
newsRoutes.use(express.json());
const ajv = new Ajv();
dotenv.config();

const validatePreferences = ajv.compile(preferencesSchema);

newsRoutes.get("/preferences", verifyToken, (req, res) => {
  res.json(req.user.preferences);
});

newsRoutes.put("/preferences", verifyToken, (req, res) => {
  try {
    const preferences = req.body;
    const validBody = validatePreferences(preferences);
    if (validBody) {
      const { id } = req.user;
      let usersData = JSON.parse(JSON.stringify(readUsers()));
      const userIndex = usersData.findIndex((user) => user.id === id);
      if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
      }
      usersData[userIndex].preferences = preferences;
      writeUsers(usersData);
      res.status(200).json({ message: "News preferences updated" });
    } else {
      return res.status(400).json({ message: "Invalid data" });
    }
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
