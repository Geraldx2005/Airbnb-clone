import Listing from "../models/listing.js";
import Review from "../models/review.js";

// Creates a new review for a specific listing and adds it to the database.
const createReview = async (req, res) => {
  let { id } = req.params;
  let { review } = req.body;
  review.author = req.user._id;

  let listing = await Listing.findById(id);
  let newReview = await Review.create(review); // Use .create() instead of insertOne when using Mongoose ---->

  listing.reviews.push(newReview);

  // we are getting the whole listing document here,
  // so we can use the .save() method to save the changes in the document ---->
  await listing.save();
  console.log("Review added successfully");
  req.flash("success", "Review added successfully!");
  res.redirect(`/listings/${id}`);
};

// Deletes a review from a specific listing and remove it from the database.
const deleteReview = async (req, res) => {
  let { listingId, reviewId } = req.body;
  await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  console.log("Review deleted successfully");
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${listingId}`);
};

export default { createReview, deleteReview };
