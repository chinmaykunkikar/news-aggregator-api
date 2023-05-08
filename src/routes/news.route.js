const Ajv = require("ajv");
const axios = require("axios");
const dotenv = require("dotenv");
const express = require("express");
const newsRoutes = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const { readUsers, writeUsers } = require("../utils/usersFile.util");
const preferencesSchema = require("../schemas/preferences.schema");
const getOrSetCache = require("../utils/redisCache.util");

newsRoutes.use(express.urlencoded({ extended: false }));
newsRoutes.use(express.json());
const ajv = new Ajv();
dotenv.config();

const validatePreferences = ajv.compile(preferencesSchema);

// GET /news/preferences
newsRoutes.get("/preferences", verifyToken, (req, res) => {
  res.json(req.user.preferences);
});

// PUT /news/preferences
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

// GET /news
newsRoutes.get("/", verifyToken, async (req, res) => {
  const { id, preferences } = req.user;
  let usersData = JSON.parse(JSON.stringify(readUsers()));
  const userIndex = usersData.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    const sources = preferences.sources.join(",");
    const news = await getOrSetCache(`news-sources-${sources}`, async () => {
      const newsResponse = await axios.get(
        "https://newsapi.org/v2/everything",
        {
          params: {
            sources,
            apiKey: process.env.NEWSAPI_KEY,
          },
        }
      );
      return newsResponse.data.articles;
    });
    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET /news/top
newsRoutes.get("/top", verifyToken, async (req, res) => {
  const { id, preferences } = req.user;
  let usersData = JSON.parse(JSON.stringify(readUsers()));
  const userIndex = usersData.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    const category = preferences.categories.join(",");
    const news = await getOrSetCache(`news-category-${category}`, async () => {
      const newsResponse = await axios.get(
        "https://newsapi.org/v2/top-headlines",
        {
          params: {
            category,
            apiKey: process.env.NEWSAPI_KEY,
          },
        }
      );
      return newsResponse.data.articles;
    });
    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = newsRoutes;
