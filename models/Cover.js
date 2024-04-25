const mongoose = require('mongoose')

const CoverSchema = new mongoose.Schema({
    _id: Number,
    height: Number,
    image_id: String,
    width: Number,
})

const CoverModel = mongoose.model("covers", CoverSchema)
module.exports = CoverModel