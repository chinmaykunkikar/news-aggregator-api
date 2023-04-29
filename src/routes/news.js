const express = require("express");
const newsRoutes = express.Router();

const verifyToken = require("../middleware/auth");

newsRoutes.use(express.urlencoded({ extended: false }));
newsRoutes.use(express.json());

newsRoutes.get("/preferences", verifyToken, (req, res) => {
  res.json(req.user.preferences);
});

module.exports = newsRoutes;
