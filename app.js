const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/indexRoutes");
const errorHandler = require("./controllers/errorHandler");
const AppError = require("./utility/appError");
const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoURI =
  process.env.NODE_ENV !== "test" ? process.env.DB : process.env.DB_TEST;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log("DB Connection not successful");
  });

app.use("/api", routes);

app.all("*", (req, res, next) => {
  next(new AppError(`Thus endpoint  ${req.originalUrl} does not exist!`, 404));
});

app.use(errorHandler);

module.exports = app;
