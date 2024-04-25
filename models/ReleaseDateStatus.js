const mongoose = require('mongoose')

const ReleaseDateStatusSchema = new mongoose.Schema({
    _id: Number,
    name: String,
})

const ReleaseDateStatusModel = mongoose.model("release_dates_statuses", ReleaseDateStatusSchema)
module.exports = ReleaseDateStatusModel