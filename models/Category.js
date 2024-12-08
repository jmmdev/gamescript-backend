const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    _id: Number,
    name: String,
    slug: String,
    description: String,
})

const CategoryModel = mongoose.model("categories", CategorySchema)
module.exports = CategoryModel