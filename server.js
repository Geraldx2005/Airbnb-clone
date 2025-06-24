// Load env variables at the very top (accessable throughout the app)
import 'dotenv/config';
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
const app = express();
const port = 3000;

// Conecting to database.
connectDB();

// Importing from other files.
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import expressError from "./utils/expressError.js";
import User from "./models/user.js";

// Setting the view engine to jj.
app.set("view engine", "ejs");

// use ejs-locals for all ejs templates.
app.engine("ejs", ejsMate);

// Setting the views and public directory paths.
const file_name = fileURLToPath(import.meta.url);
const __dirname = path.dirname(file_name);
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Setting some middlewares.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Setting the session options.
// Note: The secret key should be stored in an environment variable in production.
let sessionOptions = {
  secret: "thesecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() * 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true, // helps to prevent XSS attacks
  },
};

// middleware for session management
app.use(session(sessionOptions));
// middleware for flash messages
app.use(flash());

// Middleware for passport initialization and session management.
app.use(passport.initialize());
// Middleware for passport session management.
app.use(passport.session());
// Passport local strategy for user authentication.
passport.use(new LocalStrategy(User.authenticate()));
// Passport serialize and deserialize user for session management.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for flash messages to local variables for rendering in views.
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user; // Add current user to res.locals
  next();
});

// Silently ignore requests for .json files (return 204 No Content instead of 404)
// Prevents "Page Not Found" errors in the console for missing JSON files
app.use((req, res, next) => {
  const silentAssets = [".ico", ".png", ".jpg", ".map", ".json"];
  if (silentAssets.some((ext) => req.url.endsWith(ext))) {
    return res.status(204).end(); // ← this ends the request too early!
  }
  next();
});

// Adding fake user data to the db for testing purposes.
app.get("/demo", async (req, res) => {
  let fakeUser = new User({
    username: "John Doe",
    email: "john@gmail.com",
  });

  // Registering the fake user with hashed password using passport-local-mongoose plugin.
  // .register method itself checks the usename is already exists or not, if it exists then it throws an error.
  // NOTE: Static method means we call it on the class, not an object (e.g., User.register)

  let demoUser = await User.register(fakeUser, "password123");
  res.send(demoUser.hash);
});

// IMPORTANT: if we set an params in server.js file we have to use mergeParams: true in the router, otherwise it will not work.
// Index routes.
app.use("/listings", routes.listingsRoute);
// User review.
app.use("/review", routes.reviewRoute);
// User routes.
app.use("/user", routes.userRoute);

// The correct and professionl way to send error 404 message.
app.all("*", (req, res, next) => {
  next(new expressError("Page Not Found", 404));
});

// Our custom error handler.
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  console.log(err);
  // res.status(statusCode).send(message);
  res.status(statusCode).render("listings/error.ejs", { statusCode, message, title: "Error", pageCSS: "error" });
});

// Our custom 404 page => Not recommended...
// app.use((req, res) => {
//     res.status(404).send("404 - Page Not Found");
// })

app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
