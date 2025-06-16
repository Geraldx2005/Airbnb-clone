import mongoose from "mongoose";
const Schema = mongoose.Schema;

// This schema is intentionally left empty to allow for flexible reviwew structures.
const reviewSchema = new Schema({
  comment: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now() },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});
const Review = mongoose.model("Review", reviewSchema);

export default Review;
