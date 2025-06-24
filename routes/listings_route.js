import express from "express";
import asyncHandler from "express-async-handler";
import multer from "multer";
import { validateListing, isAuthenticated, isOwner } from "../middleware.js";
import listingsCtrl from "../controller/listings_ctrl.js";
import storage from "../cloudConfig.js";
const router = express.Router();

// Setting up multer for file uploads.
const uploads = multer({ storage });

// IMPORTANT: if we set an params in server.js file we have to use mergeParams: true in the router, otherwise it will not work.

// -------- THE LISTING ROUTES -------- //

// Using router.route() to define multiple HTTP methods for the same path.
router.route("/")
  // The index route which shows the title and image of every hotels.
  .get(asyncHandler(listingsCtrl.renderHomePage))
  // The post route which creates the listing and adds to database.(add button in the addform)
  .post(isAuthenticated, uploads.single('image'), validateListing, asyncHandler(listingsCtrl.createListing));

// The route gives a form to add listing to the form.(The add button)
router.get("/new", isAuthenticated, listingsCtrl.renderAddForm);

router.route("/:id")
  // The show route which shows the details of the hotel in detail.
  .get(asyncHandler(listingsCtrl.renderShowPage))
  // The patch route which updates the data in the database. (The update button in the edit form)
  .patch(isAuthenticated, isOwner, uploads.single('image'), validateListing, asyncHandler(listingsCtrl.updateListing))
  // The delete route which deletes the listing from the database. (The delete button in the show page)
  .delete(isAuthenticated, isOwner, asyncHandler(listingsCtrl.deleteListing));

// The edit route which gives the prefilled update form to the user(edit button in the show page)
router.get("/:id/edit", isAuthenticated, isOwner, asyncHandler(listingsCtrl.renderEditForm));

export default router;
