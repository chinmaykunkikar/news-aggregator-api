const express = require("express");
const helmet = require("helmet");
const routes = express.Router();

const news = require("./routes/news.route");
const { login, register } = require("./controllers/auth.controller");

let PORT;
const app = express();

app.use(helmet());
app.use(routes);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

routes.use(express.json());
routes.use(express.urlencoded({ extended: false }));

routes.get("/", (_, res) => {
  res.status(200).send("<h3>Welcome to the News Aggregator API</h3>");
});

routes.use("/news", news);

routes.post("/register", register);

routes.post("/login", login);

if (process.env.PORT !== "") {
  PORT = process.env.PORT;
} else {
  PORT = 3000;
}

app
  .listen(PORT, (error) => {
    if (!error) console.log("Server is running on port " + PORT);
  })
  .on("error", (error) => console.error("Cannot start the server.\n", error));
