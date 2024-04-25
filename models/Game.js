const mongoose = require('mongoose')

const GameSchema = new mongoose.Schema({
    _id: Number,
    age_ratings: [Number],
    aggregated_rating: Number,
    aggregated_rating_count: Number,
    category: Number,
    cover: Number,
    genres: [Number],
    language_supports: [Number],
    name: String,
    rating: Number,
    rating_count: Number,
    release_dates: [Number],
    screenshots: [Number],
    similar_games: [Number],
    slug: String,
    summary: String,
    tags: [Number],
    themes: [Number],
    total_rating: Number,
    total_rating_count: Number,
    url: String,
})

const GameModel = mongoose.model("games", GameSchema)
module.exports = GameModel