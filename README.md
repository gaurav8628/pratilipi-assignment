# pratilipi-assignment

# Fullstack Microservices App

<!-- ABOUT THE PROJECT -->
## About The Project
A  Backend web application with three microservices namely user service and content service and one gateway service where 
#
  -> User Service supports :- Register,Login,User Bonus,GetUserId
#
  -> Content Service :- Content ingestion, story bonus, Content fetching
#
  -> Gateway Service :- It is getting used used for interservice communication it is connected to mongodb database like the other service and   whenever data is communicated from one service to another it stores the data as event and if any service is down for sometime due to any reason it can recover the data from here and using seperate service for inter-service communication also help if we want to add any service later that can be done with very less efforts.

<p align="right">(<a href="#top">back to top</a>)</p>


### Built With

* [Express.js](https://expressjs.com/)
* [Node.js](https://nodejs.dev/)
* [Docker](https://docker.com)
* [MongoDb](https://www.mongodb.com/)

<p align="right">(<a href="#top">back to top</a>)</p>


### Prerequisites

* nodejs - v14.17.3
#
  Linux :- ```sudo apt install nodejs```
#
  Windows :- ```https://www.mongodb.com/try/download/community```
* npm - v6.14.13
  ```npm install npm@latest -g```
* 
*docker - Docker version 20.10.11
* 
  Linux :- ```sudo snap install docker```
* 
  Windows :- ```https://docs.docker.com/desktop/windows/install/```



<!-- GETTING STARTED -->
## Getting Started and Installation

1. create an empty directory in your local machine and use command `git init`

2. Clone this repository using `git clone https://github.com/gaurav8628/pratilipi-assignment.git` in above directory

3. cd into `pratilipi-assignment` directory

4. Run docker compose to start the backend service.
  Linux :- ```sudo docker-compose up --build```
  Windows :- ```docker-compose up --build```



<p align="right">(<a href="#top">back to top</a>)</p>


<!-- ROADMAP -->
## Postman Collection

Postman collection could be imported from `postman` directory.
It contains information for the following endpoints
1. Register 
2. UserId - Added a pre requesst script that will register the user and the api will return the user id of the user from email.
3. Bonus User - Added a prerequest script that will register the user and this api will give him a bonus chapter
4. User - To get the list of all users with their details.

5. Upload Content - Post api to send a series manually.
6. File Upload - Uploaded a dummy csv file in csv folder in this repo for testing this api. we need to add it in  body in form-data with key as  `stories` and uploading ghe csv file.  
7. Get Content - Get all the content available
8. Bonus Story - I have added a pre-request script that will uppload a series and then thsi api will give a bonus chapter using series name.
9. Content User - It return the series and chapters avaiable to user for reading we neeed to add userId in this that you can get in response when we registers a user or we can also get the userId of the user using the userId endpoint with email.

<p align="right">(<a href="#top">back to top</a>)</p>

## HLD
![HLD_Fullstack-microservice](https://github.com/gaurav8628/pratilipi-assignment/blob/main/images/hld_microservices.png) 

## LLD 
### Database Schema
There are three databases one for each microservice(currently running in same mongodb docker instance)
1. User Service database   
This consists of one data collections 
* Users 
```
 email: {
    type: String,
    required: true,
  },
  password: { 
    type: String 
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
```


2. Content-Service database   
This consists of two data collection
* Contents 
```
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
```
*users
```
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

```
### Endpoints
#### User Service
1. `user:8001/api/register` - Validates the format of email/password. Checks if the email is already present in database. Encrypts password and adds email and password to database. Generates JWT on the basis of uniquely returned user_id. Returns JWT and email.
2. `user:8001/api/login` - Validates the format of email/password. Checks if the email is present in database. Decrypts the password compares from password of input. Generates JWT on the basis of uniquely returned user_id. Returns JWT and email.
3. `user:8001/api/getUserId` - Return the userId of user from with emailId
4. `user:8001/api/bonus/user` - Increase the bonus chapter count in database for the user.
#### Content Service
1. `content:8002/api/content` - Returns all the content from database.
2. `content:8002/api/file/upload` - Parse the csv file and search for the title from database and the title of series doesn't match then uploads the series in databse.
3. `content:8002/api/bonus/story` - Increase the bonus count for series in database.
4. `content:8002/api/upload` - Search for the series title in database and if the title doesn't match then upload the series in database.
#### Gateway Service
1. `gateway:8000/events` - Receives the data one service wants to sens to another and stores the data in database also sends it to other service and concered service process the data and performs the actions on it. We are storing the data because it any service is down for sometime so that it can later recover the data it wants. Time cleanup of database can be performed to save storage charges.
<p align="right">(<a href="#top">back to top</a>)</p>

## Thank You!

