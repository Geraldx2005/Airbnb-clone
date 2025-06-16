import mongoose from "mongoose";

let listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set: (v) => {
      return v === ""
        ? "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v;
    },
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

let Listing = mongoose.model("Listing", listingSchema);

export default Listing;

// IMPORTANT NOTE: ---->
// When you define a Mongoose middleware (a.k.a. hooks) inside a model file, it is automatically attached to the schema.
// Once the schema is compiled into a model using mongoose.model(), Mongoose handles calling the middleware for you
// whenever the relevant action (like save, remove, findOneAndDelete, etc.) is triggered.
