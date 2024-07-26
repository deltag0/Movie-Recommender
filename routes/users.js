const express = require("express");
const router = express.Router();
const routerPassword = express.Router();
const {login, register, signupPage, createNew, reset, reset_last, reset_view_last,
    reset_view, createNew_view
} = require("../controller/userController");
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/signup").get(signupPage);
router.route("/createPassFunc").post(createNew);
router.route("/reset").post(reset);
router.route("/chooseNew").post(reset_last);
router.route("/createNewPassword").get(createNew_view);
router.route("/reset_password/").get(reset_view);
router.route("/reset_last").get(reset_view_last);
module.exports = router