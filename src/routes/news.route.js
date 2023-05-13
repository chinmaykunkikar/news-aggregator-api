const express = require("express");
const newsRoutes = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const { getNews, getTopNews } = require("../controllers/news.controller");
newsRoutes.use(express.urlencoded({ extended: false }));
newsRoutes.use(express.json());

newsRoutes.get("/", verifyToken, getNews);

newsRoutes.get("/top", verifyToken, getTopNews);

module.exports = newsRoutes;
