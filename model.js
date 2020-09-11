const mongoose = require("mongoose");

//schema

const allUrlsSchema = new mongoose.Schema({
    price : {
        type: String,
    },
    beds : {
        type: String,
    },
    cars : {
        type: String,
    },
    size : {
        type: String,
    }

});

module.exports = allUrlsSchema