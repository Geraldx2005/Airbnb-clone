import express from "express";
import asyncHandler from "express-async-handler";
import { validateReview, isAuthenticated, isReviewAuthor } from "../middleware.js";
import reviewCtrl from "../controller/review_ctrl.js";
const router = express.Router();

// -------- THE REVIEW ROUTES -------- //

// The review form which adds a review to the listings collection as well as the reviews collection.
router.post("/:id", isAuthenticated, validateReview, asyncHandler(reviewCtrl.createReview));

// Review delete route which deletes the review from the database.(delete button in each review);
router.delete("/del", isAuthenticated, isReviewAuthor, asyncHandler(reviewCtrl.deleteReview));

export default router;
