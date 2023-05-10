const express = require("express");
const rootRoutes = express.Router();

const { login, register } = require("../controllers/auth.controller");

rootRoutes.use(express.json());
rootRoutes.use(express.urlencoded({ extended: false }));

rootRoutes.get("/", (_, res) => {
  res.status(200).send("<h3>Welcome to the News Aggregator API</h3>");
});

rootRoutes.post("/register", register);
rootRoutes.post("/login", login);

module.exports = rootRoutes;
