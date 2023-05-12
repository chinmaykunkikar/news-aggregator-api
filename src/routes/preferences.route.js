const express = require("express");
const prefRoutes = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const {
  getPreferences,
  updatePreferences,
} = require("../controllers/preferences.controller");

prefRoutes.use(express.urlencoded({ extended: false }));
prefRoutes.use(express.json());

prefRoutes.get("/", verifyToken, getPreferences);

prefRoutes.put("/", verifyToken, updatePreferences);

module.exports = prefRoutes;
