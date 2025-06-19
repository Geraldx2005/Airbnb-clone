import Listing from "../models/listing.js";
import Review from "../models/review.js";

// Renders the home page with all listings from the database.
const renderHomePage = async (req, res) => {
  let allListings = await Listing.find({}).sort({ _id: -1 });
  res.render("listings/home.ejs", { allListings, title: "Airbnb - Home", pageCSS: "home" });
};

// Renders the form to add a new listing.
const renderAddForm = (req, res, next) => {
  try {
    res.render("listings/newForm.ejs", { title: "Airbnb - New Listing", pageCSS: "newForm" });
  } catch (error) {
    next(error);
  }
};

// Renders the show page for a specific listing by its ID.
const renderShowPage = async (req, res) => {
  let { id } = req.params;
  // using nested populate to get the reviews and the owner details in the listings document.
  let listingData = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listingData) {
    req.flash("error", "Data has been already deleted from the database!");
    res.redirect("/listings");
    return;
  }
  res.render("listings/show.ejs", { listingData, title: "Listing Details", pageCSS: "show" });
};

// Creates a new listing and adds it to the database.
const createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  req.body.owner = req.user._id; // Add the owner id to the listing data from the current user who is logged in.
  req.body.image = { url, filename }; // Add the image data to the listing data.
  await Listing.create(req.body);

  req.flash("success", "New listing added successfully!");
  console.log("Data inserted successfully");
  res.redirect("/listings");
};

// Renders the edit form to update an existing listing by its ID.
const renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Data has been already deleted from the database!");
    res.redirect("/listings");
    return;
  }
  res.render("listings/updateForm.ejs", { listing, title: "Update Listing", pageCSS: "updateForm" });
};

// Updates an existing listing in the database by its ID.
const updateListing = async (req, res) => {
  let { id } = req.params;
  let data = req.body;
  let { price } = req.body;
  data.price = Number(price);

  await Listing.findByIdAndUpdate(id, data);
  console.log("Data updated successfully");
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

// Deletes a listing from the database by its ID and also deletes all associated reviews.
const deleteListing = async (req, res) => {
  let { id } = req.params;
  let listingData = await Listing.findByIdAndDelete(id);
  await Review.deleteMany({ _id: { $in: listingData.reviews } });

  console.log("Deletion successful");
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};

export default {
  renderHomePage,
  renderAddForm,
  renderShowPage,
  createListing,
  renderEditForm,
  updateListing,
  deleteListing,
};
