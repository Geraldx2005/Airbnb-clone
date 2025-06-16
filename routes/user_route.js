import express from "express";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import userCtrl from "../controller/user_ctrl.js";
let router = express.Router();

// -------- THE USER ROUTES -------- //

// Route to render the sign in page.
router.get("/signup", userCtrl.renderSignupPage);

// Route to register and add the user details to the database.
router.post("/signup", userCtrl.createUser);

// Route to render the login page.
router.get("/login", userCtrl.renderLoginPage);

// Route to authenticate the user and log then in.
// Passport.autenticate() resets the session and adds the user details to the session if the authentication is successful.
// It resets the session that's the reason we are saving the redirectURL in locals before authentication.
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", { failureRedirect: "/user/login", failureFlash: true }),
  userCtrl.loginUser
);

// Route to log out the user.
router.get("/logout", userCtrl.logoutUser);

export default router;
