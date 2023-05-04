const express = require("express");
const routes = express.Router();
const news = require("./routes/news.routes");

const { login, register } = require("./controllers/auth.controller");

const PORT = 3000;
const app = express();

app.use(routes);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

routes.use(express.json());
routes.use(express.urlencoded({ extended: false }));

routes.get("/", (req, res) => {
  res.status(200).send("<h3>Welcome to the News Aggregator API</h3>");
});

routes.use("/news", news);

routes.post("/register", register);

routes.post("/login", login);

app
  .listen(process.env.PORT || PORT, (error) => {
    if (!error) console.log("Server is running on port " + PORT);
  })
  .on("error", (error) => console.error("Cannot start the server.\n", error));
