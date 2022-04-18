// schema for user registration and login   
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');

const userSchema= mongoose.Schema({
    email : {
        type: String, 
        required: true, 
        unique:true
    },
    password : {
        type: String, 
        required: true
    },
    first_name : {
        type: String, 
        required: true
    },
    last_name : {
        type: String, 
        required: true
    },
    phone: {
        type: String,
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
const model = mongoose.model('userDetails', userSchema)

// exporting the module to auth.js in controller
module.exports = model