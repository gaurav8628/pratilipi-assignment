const mongoose = require('mongoose');


// schema for storing events so if a service is down for sometime then it can cover the data it has lost
const eventSchema = new mongoose.Schema({
    events:{
        type:Object
    }

    
})

// creating a module for exporting
const model = mongoose.model('events', eventSchema);

// exporting the module
module.exports = model