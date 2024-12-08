const mongoose = require('mongoose')

const ThemeSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    slug: String,
    description: String,
})

const ThemeModel = mongoose.model("themes", ThemeSchema)
module.exports = ThemeModel