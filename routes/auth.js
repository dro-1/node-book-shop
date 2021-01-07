const express = require("express");

const router = express.Router();

const authController = require("./../controllers/authController");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/reset", authController.getReset);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.post("/signup", authController.postSignup);

router.post("/reset", authController.postReset);

router.get("/reset/:resetToken", authController.getUpdatePassword);

router.post("/new-password", authController.postUpdatePassword);

module.exports = router;
