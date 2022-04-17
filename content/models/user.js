
// schema for storing the required information of user for streaming the content to them   
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');

const userSchema= mongoose.Schema({
    user_id:{
        type:String,
        required: true
    },
    dateOfRegistering: {
        type: Date,
        required: true
    },
    bonus: {
        type: Number,
        default: 0,
    }

});


// creating a module for exporting
const model = mongoose.model('userDetailsContent', userSchema)

// exporting the module 
module.exports = model