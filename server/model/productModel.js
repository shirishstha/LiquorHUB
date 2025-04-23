//external module
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        lowercase:true,
        required:true,
        unique:true
    },
    price:{
        type: Number,
        required: true
    },
    shipping:{
        type: Boolean
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
   
    },
    description:{
        type: String,
        required: true
    },
    quantity:{
        type:Number,
        required: true
    },
    photo: {
         data: Buffer,
         contentType : String
    }
},{timeStamps: true});

module.exports = mongoose.model('Products', productSchema);