# pratilipi-assignment

# Fullstack Microservices App

<!-- ABOUT THE PROJECT -->
## About The Project
![Fullstack-microservice](https://github.com/mahakporwal02/fullstack-microservice-app/blob/master/images/screenshot_app.png) 
A full stack web application with two microservices namely user-interaction-service and content service which supports features like registeration, login, serving content, ingesting content in the form of CSV and liking/unliking content.

<p align="right">(<a href="#top">back to top</a>)</p>


### Built With

* [Vue.js](https://vuejs.org/)
* [Express.js](https://expressjs.com/)
* [Node.js](https://nodejs.dev/)
* [Bootstrap](https://getbootstrap.com)
* [Docker](https://docker.com)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started and Installation
### Backend
1. cd into `backend/user-interaction-service` directory
```cd backend/user-interaction-service```
2. create a .env file add a token
```
touch .env
echo TOKEN_KEY=<YOUR_TOKEN> >> .env
```
3. Get back to `backend` directory
```cd ..```
4. Run docker compose to start the backend service.
```sudo docker-compose up --build```
### Frontend
1. cd into `frontend` directory from root and install dependencies
```
cd frontend
npm install
```
2. Start frontend server
```npm run serve```

### Prerequisites

* nodejs - v15.0.0
  ```sudo apt install nodejs```
* npm - v7.0.2
  ```npm install npm@latest -g```'
*docker - Docker version 20.10.7, build 20.10.7-0ubuntu5~20.04.2
  ```sudo snap install docker```

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- ROADMAP -->
## Postman Collection

Postman collection could be imported from `postman` directory.
It contains information for the following endpoints
1. Register 
2. Login - I have added a pre-request script that will register automatically so that login credentials aren't invalid.
3. Ingest Content - I have added a pre-request script that will register and login automatically and then add authentication token to the headers as a key-value pair - `x-auth-token : <token>`. Also a dummy `.CSV` file has been provided in `CSV` directory for testing purpose which should be placed in body with name as `file` under form-data.
4. Get Content - I have added a pre-request script that will register and login automatically and then add authentication token to the headers as a key-value pair - `x-auth-token : <token>`.(You may need to ingest the dummy csv file first to test this endpoint else it will return an empty array).
5. Update Like - I have added a pre-request script that will register and login automatically and then add authentication token to the headers as a key-value pair - `x-auth-token : <token>`.

<p align="right">(<a href="#top">back to top</a>)</p>

## HLD
![HLD_Fullstack-microservice](https://github.com/mahakporwal02/fullstack-microservice-app/blob/master/images/HLD_Micro.svg) 

## LLD 
### Database Schema
There are two databases one for each microservice(currently running in same mongodb docker instance)
1. User-Interaction-Service database   
This consists of two data collections 
* Users 
```
 email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: { type: String },
```
* Likes
```
 title: { type: String, unique: true },
 likes: { type: Array}
```

2. Content-Service database   
This consists of one data collection
* Contents 
```
  title: { type: String, unique: true },
  story : { type: String },
  date_published: { type: Date },
  user_id: { type: String }
```
### Endpoints
#### User-Interaction-Service
1. `user-interaction-service:3000/users/register` - Validates the format of email/password. Checks if the email is already present in database. Encrypts password and adds email and password to database. Generates JWT on the basis of uniquely returned user_id. Returns JWT and email.
2. `user-interaction-service:3000/users/login` - Validates the format of email/password. Checks if the email is present in database. Decrypts the password compares from password of input. Generates JWT on the basis of uniquely returned user_id. Returns JWT and email.
3. `user-interaction-service:3000/users/validate` - Validates the user by checking the JWT token in headers.
4. `user-interaction-service:3000/likes/read` - Returns an object consisting of key as title of content and value as array of users who liked the content.(This endpoint is required by getContent for information of `likes`)
5. `user-interaction-service:3000/likes/update` - This will validate the JWT token present in headers. The endpoint will then validate the title by sending request to `content-servive:3001/content/validateTitle`. If the user_id is present in the array of `likes` it will remove the user_id from the array. If user_id is not present it will add the user_id to the array of `likes`.
#### Content-Service
1. `content-service:3001/content/validateTitle` - Validates the title from `Content` collection.
2. `content-service:3001/content/ingest` - Validate the user by sending request to `user-interaction-service:3000/users/validate` endpoint. Read CSV file and populate it in the `Content` collection.
3. `content-service:3001/content/getContent` - Validate the user by sending request to `user-interaction-service:3000/users/validate` endpoint. Get the `likes` data by sending request to user-interaction-service:3000/likes/read endoint. Add `likes` info to contents and return contents.
<p align="right">(<a href="#top">back to top</a>)</p>

## Thank You!

