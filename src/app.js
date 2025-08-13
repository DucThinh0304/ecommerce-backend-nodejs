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
const { checkOverload } = require("./helpers/check.connect.js");
checkOverload();
// init routes
app.get("/", (req, res, next) => {
  console.log(req.body);
  console.log(req.headers);
  res.setHeader("Set-Cookie", "123");
  return res.status(200).json({
    message: `Hello from the server!`,
  });
});

// handling error

module.exports = app;
