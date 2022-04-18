const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const userSchema = require('../models/user')
const auth = require('../middleware/auth');
const axios = require('axios');


// api for getting all the users
router.get('/users',(req,res) => {
    const result = userSchema.find();
    res.send({status:'ok',users:result});
})


// api for registering the user
router.post('/register',async (req,res) =>{
    console.log(req.body)
    try{
        
            const user=await userSchema.findOne(
            {
                email:req.body.email,
            })
            if(!user)
            {
                
                
                const entry = await userSchema.create(
                    {
                        email: req.body.email,
                        password: req.body.password,
                        first_name:req.body.first_name,
                        last_name:req.body.last_name,
                        phone:req.body.phone,
                        dateOfRegistering: new Date()
                    })

                const user = await userSchema.findOne({email: req.body.email});
                // let user = await new userSchema({email:req.body.email,password:hashedPass});
                // creting a token
                const token = await jwt.sign({
                    email:req.body.email,
                    user_id: user._id,

                },'SECRET123',{expiresIn: '1hr'})
                res.cookie('token',token,{expiresIn:'1hr'})

                await axios.post('http://gateway:8000/events', {
                    type: 'UserCreated',
                    data: {
                    id: entry._id,
                    dateOfRegistering: new Date()
                    }
                });


                return res.header('x-auth-token',token).json({status:'ok', user:token,id:user._id,message:'successfull registration and login'})
            }
            else
            {
                return res.json({status:"error", user:false,message:'email already exist'})
            }

    }
    catch (err)
    {
        return res.status(400).json({status:'error', error:err})

    } 
});



router.post('/login' , async (req,res) => {

    const user=await userSchema.findOne(
        {
            email:req.body.email,
            password: req.body.password
        })

        if(user)
        {
            const token = await jwt.sign({
                email:req.body.email,
                user_id: user._id,

            },'SECRET123',{expiresIn: '1hr'})
            res.cookie('token',token,{expiresIn:'1hr'})

            return res.header('x-auth-token',token).json({status:'ok', user:token,id:user._id,message:'successfully logged in user'})
        }
        else
        {
            res.json({status:"user doesn't exist"});
        }

})



// api for getting the user id of user using his mail id created this api because we will need user id of user foe fetching the stories for him 
router.post('/getUserId', async (req,res) => {

    const user = await userSchema.findOne({email: req.body.email});
    if(!user) return res.send('invalid email or password');


    const token = await jwt.sign({
        email:req.body.email,
        user_id: user._id,
    },'SECRET123',{expiresIn: '1hr'})
    res.cookie('token',token,{expiresIn:'1hr'})
  
      return res.json({userId:user._id});      
});





// api for changing the user password
router.post('/update-password',auth,async (req,res) => {
    console.log(req.user);
    const user=await userSchema.findOne(
        {
            email:req.body.email,
        })
        if(user)
        {
            const salt = await bcrypt.genSalt(10);
                hashedPass = await bcrypt.hash(req.body.newPassword,salt);
                
            user.password=hashedPass;
            user.save(function(err){
                if(err) return res.json({staus:'failed', message:'unable to update password'})
                else return res.json({status:'ok', message:'password updated successfully'})
            })
        }
        else
        return res.json({staus:'failed', meassage:'enter correct email or password'})
});


// api for giving bonus chapters to the users
router.post('/bonus/user',async (req,res) => {

    var currbonus,id;
    await userSchema.find({email:req.body.email_id})
    .then((result) => {
        console.log(result[0].bonus);
        currbonus=result[0].bonus;
        id=result[0]._id;
    })


    const result = await userSchema.findByIdAndUpdate(id,{
        $set:{
            bonus: currbonus+1
        }
    },{new:true}) 


    // if we give bonus chapters to user we need to tell this to the content service so we make a post request to 
    // gateway from where it sends it to the content service api
    await axios.post('http://gateway:8000/events', {
        type: 'UserBonus',
        data: {
            id: id,
            bonus: result.bonus
        }
    });

    res.json({status:'ok'});
        
})




// route for recieveing the events
router.post('/events', async (req,res) => {
    console.log(`event received of type ${req.body.type} on user service`);
    res.json({status:'0k'});
})



module.exports=router;