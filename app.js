const express = require("express");
const serveIndex = require("serve-index");
const path = require("path");
const colors = require("colors");
app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const fs = require("fs");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("connecting to database".cyan.underline);
  })
  .catch((err) => {
    logger.error(`Error: ${err.message}`.red.underline.bold);
  });
app.use(cors());

app.use(express.json());
app.use(middleware.requestLogger);
app.use(express.static("uploads/images"));
app.use(
  "/uploads/images",
  express.static("uploads/images"),
  serveIndex("uploads/images", { icons: true })
);

// app routes
// auto import routes with fs
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require("./routes/" + r))
);
app.use(middleware.unknwnEndPoint);
app.use(middleware.errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info("app start at".yellow.bold, PORT);
});
