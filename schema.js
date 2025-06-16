import joi from "joi";

// The schema for the listing, There should be an object in the req.body to use the joi.
// Here we have the listing object in the req.body, so we are using the object schema.

export const listingSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    image: joi.string().allow("", null),
    price: joi.number().required().min(0),
    location: joi.string().required(),
    country: joi.string().required(),
});

export const reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required().trim()
    }).required()
});

// export default {listingSchema, reviewSchema};
