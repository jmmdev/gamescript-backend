const mongoose = require('mongoose')

const AgeRatingSchema = new mongoose.Schema({
    _id: Number,
    rating_img_id: Number,
    content_descriptions: [Number],
})

const AgeRatingModel = mongoose.model("age_ratings", AgeRatingSchema)
module.exports = AgeRatingModel