import express from "express";
import asyncHandler from "express-async-handler";
import { validateListing, isAuthenticated, isOwner } from "../middleware.js";
import listingsCtrl from "../controller/listings_ctrl.js";
const router = express.Router();

// IMPORTANT: if we set an params in server.js file we have to use mergeParams: true in the router, otherwise it will not work.

// -------- THE LISTING ROUTES -------- //

// The index route which shows the title and image of every hotels.
router.get("/", asyncHandler(listingsCtrl.renderHomePage));

// The route gives a form to add listing to the form.(The add button)
router.get("/new", isAuthenticated, listingsCtrl.renderAddForm);

// The show route which shows the details of the hotel in detail.
router.get("/:id", asyncHandler(listingsCtrl.renderShowPage));

// The post route which creates the listing and adds to database.(add button in the addform)
router.post("/", isAuthenticated, validateListing, asyncHandler(listingsCtrl.createListing));

// The edit route which gives the prefilled update form to the user(edit button in the show page)
router.get("/:id/edit", isAuthenticated, isOwner, asyncHandler(listingsCtrl.renderEditForm));

// The patch route which updates the data in the database. (The update button in the edit form)
router.patch("/:id", isAuthenticated, isOwner, validateListing, asyncHandler(listingsCtrl.updateListing));

// The delete route which deletes the listing from the database. (The delete button in the show page)
router.delete("/:id", isAuthenticated, isOwner, asyncHandler(listingsCtrl.deleteListing));

export default router;
