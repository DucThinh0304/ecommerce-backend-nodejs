const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// init db
require("./dbs/init.mongodb");
const connect = require("./helpers/check.connect");
connect.checkOverload();
// init routes
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "welcome",
  });
});

// handling error

module.exports = app;
