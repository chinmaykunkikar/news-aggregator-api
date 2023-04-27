const express = require("express");
const bodyParser = require("body-parser");
const routes = express.Router();

const PORT = 3000;
const app = express();

app.use(routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: false }));

routes.get("/", (req, res) => {
  res.status(200).send("<h3>Welcome to the News Aggregator API</h3>");
});

app
  .listen(process.env.PORT || PORT, (error) => {
    if (!error) console.log("Server is running on port " + PORT);
  })
  .on("error", (error) => console.error("Cannot start the server.\n", error));
