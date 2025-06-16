import User from "../models/user.js";

// Renders the signup page for user registration.
const renderSignupPage = (req, res) => {
  res.render("users/signup.ejs", { title: "Airbnb - Register", pageCSS: "signup" });
};

// Creates a new user and registers them in the database.
const createUser = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });

    let registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("success", `Signup Successful! Welcome, ${registeredUser.username}`);
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/user/signup");
  }
};

// Renders the login page for user authentication.
const renderLoginPage = (req, res) => {
  res.render("users/login.ejs", { title: "Airbnb - Login", pageCSS: "signup" });
};

// Logs in the user after successful authentication.
const loginUser = async (req, res) => {
  req.flash("success", `Welcome back, ${req.user.username}!`);
  res.redirect(res.locals.redirectUrl || "/listings"); // Redirect to the original URL or listings page if not set.
};

// Logs out the user and redirects them to the login page.
const logoutUser = (req, res) => {
  // Logs the user out and handles any logout errors.
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "You have been logged out successfully!");
    res.redirect("/user/login");
  });
};

export default { renderSignupPage, createUser, renderLoginPage, loginUser, logoutUser };
