const mongoose = require("mongoose");

//schema

const allUrlsSchema = new mongoose.Schema({
    url : {
        type: String,
    },
    price : {
        type: Number,
    },
    beds : {
        type: Number,
    },
    baths : {
        type: Number,
    },
    cars : {
        type: Number,
    },
    area : {
        type: Number,
    },
    generalFeatures : {
        type: Array,
        default: []
    },
    internalFeatures : {
        type: Array,
        default: []
    },
    externalFeatures  : {
        type: Array,
        default: []
    },
    description  : {
        type: String,

    }

});

module.exports = allUrlsSchema