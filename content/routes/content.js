const express = require('express')
const router = express.Router();
const storySchema = require('../models/story');
const userSchema = require('../models/user');
const {helper} = require('../helper/eventListener');



// api for sending all the content
router.get('/content',async (req,res) => {
    const result = await storySchema.find();

    console.log(result);
    res.json({status:'ok',Stories:result});

})





// api for sending the content to the user from use id
/*
Logic for sending the cotent
-> Date of registering of user is queried from database useing useid
-> All the Series are fethed from the dabase now there are two conditions if the series is uploaded after the user registered and before the use registered
    ->If series is uploaded before use has registered
    ->Dyas difference is calculated of userRegisteringDate and Story uploaded date if its less that 4 than we make days difference aas 4
    ->The no. of chapters user sees id daysDifference+bonusChaptersSerieshas+bonusChaptersUserHas
    ->If the no. of chapter counts from the above logic goes more than the nummber of chapters the series have the we make it equla to number of chapters series have



    ->If the Series is uploaded after the user have registered then we calculate the days have passed from the time user have registered
    -> If days passed is less tha 4 then we make it 4
    ->The no. of chapters user sees id daysDifference+bonusChaptersSerieshas+bonusChaptersUserHas
    ->If the no. of chapter counts from the above logic goes more than the nummber of chapters the series have the we make it equla to number of chapters series have


*/
router.get('/user/content',async (req,res) => {

    const user =await userSchema.find({users_id:req.body.userId});
    const stories = await storySchema.find();
    // console.log(user);

    const regDate = user[0].dateOfRegistering;
    var cont = []; 
   
    stories.map((story) => {
        console.log(story);
        var metadata = {
            totalChapters : 0 ,
            unlockedChapters : 0,
            seriesName:'',
            unlockedChaptersData: [],
        }
    
        var chapters = [];
        const totalcount = story.chapter.length;
        const seriesName = story.series;
        const published_on = story.published_on;

        console.log(`total chapters count ${totalcount}, series name is ${seriesName}, published_on is ${published_on}`);

        if(published_on.getTime() > regDate.getTime())
        {
            var numberOfStories;
            const date1 = new Date();
            const daysDifference = (Math.abs(date1.getTime() - published_on.getTime()))/  (1000 * 3600 * 24);
            if(daysDifference<4)
            {
                numberOfStories = 4;
            }
            else{
                numberOfStories = daysDifference+user[0].bonus+story.bonus;
                if(numberOfStories>totalcount)
                {
                    numberOfStories = totalCount;
                }

            }

            for(var i=0;i<numberOfStories;i++)
            {
                chapters.push(story.chapter[i]);
            }
            metadata.seriesName = story.series;
            metadata.totalChapters = totalcount;
            metadata.unlockedChapters = numberOfStories;
            metadata.unlockedChaptersData = chapter;
            cont.push(metadata);


        }
        else
        {


            var numberOfStories;
            const date1 = new Date();
            var numberOfStories = (Math.abs(date1.getTime() - published_on.getTime()))/  (1000 * 3600 * 24);
            if(numberOfStories<4)
                numberOfStories=4;
            numberOfStories = numberOfStories + story.bonus+user[0].bonus;
            if(numberOfStories>totalcount)
            numberOfStories = totalcount;
            for(var i=0;i<numberOfStories;i++)
            {
                chapters.push(story.chapter[i]);
            }
            metadata.seriesName = story.series;
            metadata.totalChapters = totalcount;
            metadata.unlockedChapters = numberOfStories;
            metadata.unlockedChaptersData = chapters;
            cont.push(metadata);

            

        }
        
    })

    res.json({status:'ok' , received: cont});



})





// api for uploading the series using csv file
router.post('/file/upload',async (req,res) => {
    const file = req.files.stories;
    
    let csvData = file.data.toString();
    const rows = csvData.split('\n').slice(1);
    rows.pop();
    rows.forEach(async (row) => {
        const data = row.split(',');
        const result = await storySchema.find({series: data[0]});
        console.log(result);
        if(result.length > 0)
        {
            console.log('series already existed');
        }
        else{
            const date = new Date((new Date(2012, 0, 1)).getTime() + Math.random() * ((new Date()).getTime() - (new Date(2012, 0, 1)).getTime()));
            var arr = [];
            var chapters = {
                title: "Chapter1",
                story: data[1]+"1"
            }
            arr.push(chapters);
            await storySchema.create(
                {
                    series: data[0],
                    chapter: arr,
                    published_on: date,
                })
        }
    })

    console.log('stories saved in database');
    
    res.status(200).json({staus:'ok',message:'file received'});
    
    
});



// api for uploading a single series

router.post('/upload',async (req,res) => {
        console.log(req.body);
        const data = req.body;
        const result = await storySchema.find({series: data.seriesName});
        console.log(result);
        if(result.length>0)
        {
            res.json({message:'series already exist'});
        }
        else
        {

            const date = new Date((new Date(2012, 0, 1)).getTime() + Math.random() * ((new Date()).getTime() - (new Date(2012, 0, 1)).getTime()));
            const entry = await storySchema.create(
                {
                    series: data.seriesName,
                    chapter: data.chapters,
                    published_on: date,
                })
            console.log('stories saved in database');
            
            res.status(200).json({staus:'ok',message:'file received'});

        }
          
});






// api whenever there is a event in user service like when user registers or we give boinus chapter to a user 
router.post('/events',async (req,res) => {
    const {type,data} = req.body;
    console.log(req.body);

    // helper funnction for events
    helper(type,data);
    console.log(`event received of type ${req.body.type} on content service`);

    res.json({status:'ok'});
})




// giving bonus chapters for certain story
router.post('/bonus/story',async (req,res) => {

    var id,currbonus;

    await storySchema.find({series:req.body.seriesName})
    .then((result) => {
        console.log(result);
        currbonus=result[0].bonus;
        id = result[0]._id
    })


    const result = await storySchema.findByIdAndUpdate(id,{
        $set:{
            bonus: currbonus+1
        }
    }) 

    console.log(result);

    res.json({status:'ok'});
        
})










module.exports = router;