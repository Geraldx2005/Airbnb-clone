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
    let modSampleData = sampleData.map((item) => {
        return {...item, owner: "685077cd96a4ffc396fff562"};
    });
    await Listing.insertMany(modSampleData);
    console.log("Data seeded Successfully");
    // Close the connection after seeding.
    await mongoose.connection.close();
    console.log("Connection closed");
}