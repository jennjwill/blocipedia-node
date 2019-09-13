require("dotenv").config();
const logger = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");

module.exports = {
  init(app, express) {
    app.set("views", viewsFolder);
    app.set("view engine", "ejs");
    app.use(logger("dev"));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, "..", "assets")));
  }
};
