const express = require('express');
const app=express();
const cors = require('cors')
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
app.use(fileUpload());
require('dotenv').config();
const axios = require('axios');
const userSchema = require('./models/user');
const storySchema = require('./models/story');
const {helper} = require('./helper/eventListener');

// environment variable
port = process.env.PORT || 8002;



//middleware

app.use(express.json());
app.use(cors())



// routes
const contentRoutes = require('./routes/content');


// api just to check the server 


app.get("/",(req,res,next) => {
    res.status(200).json({'status':'ok','message':'Hello Server is Working'});
})





// db config


mongoose.connect(
    'mongodb://mongo:27017/stories',
    {
        // useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    ).then(() => {
        console.log('database connected');
    });


app.use('/api',contentRoutes);




// starting the server
app.listen(port, async () => {
    console.log(`server for content started on port ${port}`);
    
    //logic for storing the events whenever the service restarts after some downtime 
    const result = await axios.get('http://gateway:8000/events');
    console.log(result.data);

    result.data.forEach(async (data) => {
        helper(data.events.type,data.events.data)

    })
})
