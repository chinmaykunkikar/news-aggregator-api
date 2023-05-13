const axios = require("axios");

const { readUsers } = require("../utils/usersFile.util");
const getOrSetCache = require("../utils/redisCache.util");
const { NEWSAPI_KEY } = require("../configs/env.config");
const {
  ERR_SERVER_ERROR,
  ERR_USER_NOT_FOUND,
} = require("../constants/app.constants");

const PREFIX_NEWS_SOURCES = "news-sources";
const PREFIX_NEWS_CATEGORY = "news-category";
const URI_NEWSAPI_EVERYTHING = "https://newsapi.org/v2/everything";
const URI_NEWSAPI_TOP = "https://newsapi.org/v2/top-headlines";

async function getNews(req, res) {
  const { id, preferences } = req.user;
  let usersData = JSON.parse(JSON.stringify(readUsers()));
  const userIndex = usersData.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: ERR_SERVER_ERROR });
  }
  try {
    const sources = preferences.sources.join(",");
    const news = await getOrSetCache(
      `${PREFIX_NEWS_SOURCES}-${sources}`,
      async () => {
        const newsResponse = await axios.get(URI_NEWSAPI_EVERYTHING, {
          params: {
            sources,
            apiKey: NEWSAPI_KEY,
          },
        });
        return newsResponse.data.articles;
      }
    );
    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: ERR_SERVER_ERROR });
  }
}

async function getTopNews(req, res) {
  const { id, preferences } = req.user;
  let usersData = JSON.parse(JSON.stringify(readUsers()));
  const userIndex = usersData.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: ERR_USER_NOT_FOUND });
  }
  try {
    const category = preferences.categories.join(",");
    const news = await getOrSetCache(
      `${PREFIX_NEWS_CATEGORY}-${category}`,
      async () => {
        const newsResponse = await axios.get(URI_NEWSAPI_TOP, {
          params: {
            category,
            apiKey: NEWSAPI_KEY,
          },
        });
        return newsResponse.data.articles;
      }
    );
    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: ERR_SERVER_ERROR });
  }
}

module.exports = { getNews, getTopNews };
