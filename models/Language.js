const mongoose = require('mongoose')

const LanguageSchema = new mongoose.Schema({
    _id: Number,
    locale: String,
    name: String,
    native_name: String,
})

const LanguageModel = mongoose.model("languages", LanguageSchema)
module.exports = LanguageModel