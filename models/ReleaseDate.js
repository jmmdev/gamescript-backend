const mongoose = require('mongoose')

const ReleaseDateSchema = new mongoose.Schema({
    _id: Number,
    date: Number,
    human: String,
    status: Number,
})

const ReleaseDateModel = mongoose.model("release_dates", ReleaseDateSchema)
module.exports = ReleaseDateModel