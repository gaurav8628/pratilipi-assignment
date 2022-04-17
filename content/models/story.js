const mongoose = require('mongoose');

// schema for storing the content
const StorySchema = new mongoose.Schema({
    series:{
        type:String,
        unique:true
    },
    chapter:{
        type:Array,
    },
    published_on:
    {
        type: Date,
        default: Date.now()
    },
    bonus:{
        type: Number,
        default: 0,
    }

})


// creating a module for exporting
const model = mongoose.model('stories', StorySchema);

// exporting the module 
module.exports = model