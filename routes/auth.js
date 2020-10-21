const router = require("express").Router();
const { signupValidator, signInValidator } = require("../validator/auth");
const { runValidation } = require("../validator");
const userController = require("../controllers/user_controller");
const middleware = require("../utils/middleware");

router.post(
  "/users/create-or-update-user",
  middleware.isAuth,
  userController.createOrUpdateUser
);

router.post(
  "/users/current-user",
  middleware.isAuth,
  userController.currentUser
);

router.post(
  "/users/current-admin",
  middleware.isAuth,
  middleware.isAdmin,
  userController.currentUser
);
module.exports = router;
