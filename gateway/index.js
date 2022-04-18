const express =  require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
const mongoose = require('mongoose');
// const axios = require('axios');


const eventSchema = require('./models/events')

app.use(cors());
app.use(express.json());



// connecting the database
mongoose.connect(
    'mongodb://mongo:27017/events',
    {
        // useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    ).then(() => {
        console.log('database connected');
    });




// api for getting the event and sending to other service making a different api for it helps if we create any other service later it will help
// us to add it in architecture very easily and storing the events will help if the serivice needs previous data of other services
app.post('/events',async (req,res) => {
    const event = req.body;
    console.log(`event received at gateway of type ${event.type}`);


    const entry = await eventSchema.create({
        events: event
    })

    await axios.post('http://user:8001/api/events',event).catch((err) => {
        console.log(err);
    })

    console.log(`event is sent to user service`);


    await axios.post('http://content:8002/api/events',event).catch((err) => {
        console.log(err);
    })

    console.log(`event is sent to content service`);

    res.json({status:'ok'})
})



// for sending events to service service call this api only once whenever it restarts after a downtime 
// and if it has lost some data/events it can cover them
app.get('/events',async (req,res) => {

    const data = await eventSchema.find();
    console.log(data);
    res.send(data);
})
  



// starting the server on port 8000
app.listen(8000, async () => {
    console.log('gateway is listening to port 8000');

})