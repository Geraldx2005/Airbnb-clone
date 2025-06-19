import express from "express";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import userCtrl from "../controller/user_ctrl.js";
let router = express.Router();

// -------- THE USER ROUTES -------- //

// combining the two routes for signup functionality,
router.route("/signup")
// Route to render the sign in page.
.get(userCtrl.renderSignupPage)
// Route to register and add the user details to the database.
.post(userCtrl.createUser);

// combining the two routes for login functionality,
router.route("/login")
// Route to render the login page.
.get(userCtrl.renderLoginPage)
// Route to authenticate the user and log then in.
// Passport.autenticate() resets the session and adds the user details to the session if the authentication is successful.
// It resets the session that's the reason we are saving the redirectURL in locals before authentication.
.post(
  saveRedirectUrl,
  passport.authenticate("local", { failureRedirect: "/user/login", failureFlash: true }),
  userCtrl.loginUser
)

// Route to log out the user.
router.get("/logout", userCtrl.logoutUser);

export default router;
