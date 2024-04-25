const mongoose = require('mongoose')

const GenreSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    slug: String,
})

const GenreModel = mongoose.model("genres", GenreSchema)
module.exports = GenreModel