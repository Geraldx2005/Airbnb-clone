import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Listing from "../models/listing.js";
import sampleData from "./sampleData.js";
import mongoose from "mongoose";

// Connecting to database.
dotenv.config({path: "../.env"});
connectDB();

seedDB();

async function seedDB() {
    await Listing.deleteMany({});

    // Modifying the sample data to include a fixed owner ID and coordinates.
    let modSampleData = sampleData.map((item) => {
        return {...item, owner: "685c30a52a9fd38c5f61c8e4"};
    });

    // Adding fixed coordinated for all listings.
    modSampleData.forEach((item) => {
        item.geometry = {
            type: "Point",
            coordinates: [ 72.87872, 19.077793 ] // Mumbai coordinates
        }
    });
    await Listing.insertMany(modSampleData);
    console.log("Data seeded Successfully");
    // Close the connection after seeding.
    await mongoose.connection.close();
    console.log("Connection closed");
}