import mongoose from "mongoose";

let listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    url: String,
    filename: String,
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    }
  },
});

let Listing = mongoose.model("Listing", listingSchema);

export default Listing;

// IMPORTANT NOTE: ---->
// We only import packages where we actually use it.
// Other files don’t need to import it again when using this.

// This helps to keep the code clean and avoids unnecessary dependencies.
