// external module
const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    slug:{
        type:String,
        lowercase: true,
        required: true,
        unique: true

    }
});

module.exports = mongoose.model('Category', categorySchema);