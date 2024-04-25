const mongoose = require('mongoose')

const LanguageSupportSchema = new mongoose.Schema({
    _id: Number,
    language: Number,
})

const LanguageSupportModel = mongoose.model("language_supports", LanguageSupportSchema)
module.exports = LanguageSupportModel