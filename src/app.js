const express = require("express");
const helmet = require("helmet");
const routes = express.Router();

const auth = require("./routes/auth.route");
const news = require("./routes/news.route");
const preferences = require("./routes/preferences.route");
const { PORT: ENV_PORT } = require("./configs/env.config");
const {
  STATUS_ERROR,
  ERR_SERVER_START,
  MSG_SERVER_RUNNING,
} = require("./constants/app.constants");
const {
  incomingLogs,
  outgoingLogs,
} = require("./middlewares/logger.middleware");
const rateLimiter = require("./middlewares/rateLimiter.middleware");

let PORT;
const app = express();

app.use(helmet());
app.use(routes);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_, res) => {
  res.status(200).send("<h2>Welcome to the News Aggregator API</h2>");
});

routes.use(incomingLogs);
routes.use(outgoingLogs);
routes.use(rateLimiter);

routes.use("/", auth);
routes.use("/news", news);
routes.use("/preferences", preferences);

ENV_PORT !== "" ? (PORT = ENV_PORT) : (PORT = 3000);

app
  .listen(PORT, (error) => {
    if (!error) console.log(MSG_SERVER_RUNNING + PORT);
  })
  .on(STATUS_ERROR, (error) => console.error(ERR_SERVER_START, error));

module.exports = app;
