const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const dotenv = require("dotenv");
dotenv.config();

import connectDB from "./config/connectDB";
import authRouter from "./routes/authRouter";
import badmintonCourtRouter from "./routes/badmintonCourtRouter";
import courtNumberRouter from "./routes/courtNumberRouter";
import timeBookingRouter from "./routes/timeBookingRouter";
const { default: loggerWinston } = require("./config/winston");

connectDB.connect();
const app = express();

app.use(
  cors({
    origin: process.env.BASE_URL_CLIENT,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    exposedHeaders: ["X-Total-Count", "token"],
  })
);

app.use(helmet());
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  legacyHeaders: true,
  message: "Too many requests from this IP, please try again in 5 minutes",
});
app.use(limiter);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

/**
 * @toto router setup
 */
app.use("/v1/auth", authRouter);
app.use("/v1/court", badmintonCourtRouter);
app.use("/v1/court-number", courtNumberRouter);
app.use("/v1/time-booking", timeBookingRouter);

app.listen(process.env.PORT || 3000, () => {
  loggerWinston.info("server listening on port: " + (process.env.PORT || 3000));
});

module.exports = app;
