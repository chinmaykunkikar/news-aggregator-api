const express = require("express");
const helmet = require("helmet");
const routes = express.Router();

const auth = require("./routes/auth.route");
const news = require("./routes/news.route");
const preferences = require("./routes/preferences.route");
const { PORT: ENV_PORT } = require("./configs/env.config");

let PORT;
const app = express();

app.use(helmet());
app.use(routes);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_, res) => {
  res.status(200).send("<h2>Welcome to the News Aggregator API</h2>");
});

routes.use("/", auth);
routes.use("/news", news);
routes.use("/preferences", preferences);

ENV_PORT !== "" ? (PORT = ENV_PORT) : (PORT = 3000);

app
  .listen(PORT, (error) => {
    if (!error) console.log("Server is running on port " + PORT);
  })
  .on("error", (error) => console.error("Cannot start the server.\n", error));

module.exports = app;
