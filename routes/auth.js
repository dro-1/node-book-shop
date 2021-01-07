const express = require("express");

const User = require("./../models/user");

const router = express.Router();

const { check, body } = require("express-validator");

const authController = require("./../controllers/authController");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/reset", authController.getReset);

router.post(
  "/login",
  [
    body("email", "Please enter an existing user email")
      .isEmail()
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject();
          }
        });
      }),
    body("password", "Please enter a valid password")
      .isAlphanumeric()
      .isLength({ min: 6 }),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("The user already exists");
          }
        });
      }),
    body(
      "password",
      "Please enter a password that has 6 or more alphanumeric characters"
    )
      .isLength({ min: 6 })
      .isAlphanumeric()
      .custom((value, { req }) => {
        if (value.includes(" ")) {
          throw new Error("Password can't contain spaces");
        }
        return true;
      }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match");
      }
      return true;
    }),
  ],
  // .custom((value, { req }) => {
  //   if (value === "dro@dro.com") {
  //     throw new Error("This email is forbidden");
  //   }
  //   return true;
  // }),
  authController.postSignup
);

router.post("/reset", authController.postReset);

router.get("/reset/:resetToken", authController.getUpdatePassword);

router.post(
  "/new-password",
  body(
    "password",
    "Please enter a password that has 6 or more alphanumeric characters"
  )
    .isLength({ min: 6 })
    .isAlphanumeric(),
  authController.postUpdatePassword
);

module.exports = router;
