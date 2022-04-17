const userSchema = require('../models/user');
const storySchema = require('../models/story');


// function for handling the user registering events or user bonus events
async function helper(type,data)
{
 
    if(type === 'UserBonus')
        {
            console.log(`user id is ${data.id} bonus is ${data.bonus}`);
            var currbonus,id;
            await userSchema.find({user_id:data.id})
            .then((result) => {
                console.log(result[0].bonus);
                currbonus=result[0].bonus;
                id=result[0]._id;
            })


            const result = await userSchema.findByIdAndUpdate(id,{
                $set:{
                    bonus: data.bonus
                }
            }) 

            console.log('updated bonus');

        }

        if(type === "UserCreated")
        {
            const result = await userSchema.find({user_id:data.id});
            console.log(`user id is ${data.id} date of registering is ${data.dateOfRegistering}`);
            if(result.length === 0)
            {
                userSchema.create({
                    user_id:data.id,
                    dateOfRegistering:data.dateOfRegistering,
                })
                console.log('created user');
            }

            
        }
}

module.exports = {helper};
