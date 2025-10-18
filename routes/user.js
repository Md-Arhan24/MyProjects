const express = require("express");
const router = express.Router();

const passport = require("passport");
const { redirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

router.route("/singup")
.get(userController.getSingup)
.post(userController.postSingup);

router.route('/login')
.get(userController.getLogin)
//here failureFlash will throw flash with name `error` which can only be display if there is an error flash in your code
.post(redirectUrl,passport.authenticate("local", {failureRedirect: "/login",failureFlash: true,}),userController.postLogin);



router.get("/logout", userController.getLogout);

module.exports = router;
