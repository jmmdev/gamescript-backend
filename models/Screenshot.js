const mongoose = require('mongoose')

const ScreenshotSchema = new mongoose.Schema({
    _id: Number,
    height: Number,
    image_id: String,
    width: Number,
})

const ScreenshotModel = mongoose.model("screenshots", ScreenshotSchema)
module.exports = ScreenshotModel