const logger = require("./logger");
const admin = require("../firebase");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer"); // this used for image upload
const User = require("../models/User");
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const fileUpload = multer({
  // limits: 5000000000, // limit the uploaded files
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + "." + ext);
    },
    fileFilter: (req, file, cb) => {
      const isValid = !!MIME_TYPE_MAP[file.mimetype];
      let error = isValid ? null : new Error("Invalid mime type");
      cb(error, isValid);
    },
  }),
}); // this used for image upload

const requestLogger = (req, res, next) => {
  logger.info("Method", req.method);
  logger.info("path", req.path);
  logger.info("body", req.body);
  logger.info("-------");
  next();
};

const unknwnEndPoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message || error);

  if (error.name === "existingUser")
    res.status(400).json({ error: error.message });
  else if (error.name === "JsonWebTokenError")
    res.status(401).json({ error: error.message });
  else if (error.name === "photoErrorUpload")
    res.status(400).json({ error: error.message });
  else res.status(400).json({ error: error });

  next(error);
};

const isAuth = async (req, res, next) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    req.user = firebaseUser;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const isAdmin = async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email }).exec();
  if (!adminUser.isAdmin) {
    return res.status(403).json({
      message: "Only admin can access",
    });
  }
  next();
};
module.exports = {
  requestLogger,
  errorHandler,
  unknwnEndPoint,
  isAuth,
  isAdmin,
  fileUpload,
};
