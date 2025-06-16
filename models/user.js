import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

let userSchema = new mongoose.Schema({
    //Schema for username and password is created by passport-local-mongoose and also adds hash and salt to the schema.
    email: {
        type: String,
        required: true
    },
});

// Adds username, hash, salt fields and helpful methods like register() and authenticate() to the user schema.
userSchema.plugin(passportLocalMongoose);

let User = mongoose.model("User", userSchema);

export default User;