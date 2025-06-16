import expressError from "./utils/expressError.js";
import { listingSchema, reviewSchema } from "./schema.js";
import Listing from "./models/listing.js";
import Review from "./models/review.js";

// Our custom validation middleware which is used to validate the listing data sent in the request body by add listing form.
export const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((elem) => elem.message).join(",");
    console.log(errMsg);
    throw new expressError(errMsg, 400);
  } else {
    next();
  }
};

// Our custom validation middleware which is used to validate the review data sent in the request body by review form.
export const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((elem) => elem.message).join(",");
    console.log(errMsg);
    throw new expressError(errMsg, 400);
  } else {
    next();
  }
};

// Middleware function to check if the user is authenticated before accessing the routes.
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.session.redirectUrl = req.originalUrl; // Save the original URL to session so we can redirect back after login
    req.flash("error", "Please log in to continue!");
    res.redirect("/user/login");
  }
};

// Middleware function to add the route to locals which the user wanted to access but was refirected to login page.
export const saveRedirectUrl = (req, res, next) => {
  // If the user is not authenticated, save the original URL to locals so that we can redirect then back after login.
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

export const isOwner = async (req, res, next) => {
  let {id} = req.params;
  // Check if the lisiting exists and if the current user is the owner of the listing.
  let listingData = await Listing.findById(id);
  if (!listingData.owner.equals(req.user._id)) {
    req.flash("error", "You are not authorized to make changes in this listing!");
    res.redirect(`/listings/${id}`);
    return;
  }
  next();
};

export const isReviewAuthor = async (req, res, next) => {
  let {reviewId, listingId} = req.body;
  // Check if the lisiting exists and if the current user is the owner of the listing.
  let ReviewData = await Review.findById(reviewId);
  if (!ReviewData.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to delete this review!");
    res.redirect(`/listings/${listingId}`);
    return;
  }
  next();
};
