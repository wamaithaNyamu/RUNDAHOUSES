const mongoose = require("mongoose");

//schema

const allUrlsSchema = new mongoose.Schema({
    url : {
        type: String,
        default: ""
    },
    price : {
        type: String,
        default: ""
    },
    beds : {
        type: Number,
        default: 0
    },
    baths : {
        type: String,
        default: ""
    },
    cars : {
        type: String,
        default: ""
    },
    area : {
        type: String,
        default: ""
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
        default: ""
    }

});

module.exports = allUrlsSchema