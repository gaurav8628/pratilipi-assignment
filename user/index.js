const express = require('express');
const app=express();
const cors = require('cors')
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
app.use(fileUpload());
require('dotenv').config();

// environment variable
port = process.env.PORT || 8001;

//middleware
app.use(express.json());
app.use(cors())

// routes
const userRoutes = require('./routes/user');

// api just to check the server 
app.get("/",(req,res,next) => {
    res.status(200).json({'status':'ok','message':'Hello Server is Working'});
})

// db config
mongoose.connect(
    'mongodb://mongo:27017/userdetails',
    {
        // useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    ).then(() => {
        console.log('database connected');
   }
);


app.use('/api',userRoutes);


// starting the server
app.listen(port, () => {
    console.log(`server for user started on port ${port}`);
})
