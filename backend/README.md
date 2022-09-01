
# Backend

This directory contains the backend server code for saving and retreiving the encrypted file key from Mongo DB. The server is built with Express and NodeJs.

## Local Set Up

- Go to MongoDB Atlas and create a hosted MongoDB instance. Create the name space and document in it. Then enter the credentials in a .env file like below.
```
SOVEREIGNITY_DB_URI=YOUR_MONGO_DB_INSTANCE_URI
SOVEREIGNITY_NS=sovereignity
PORT=5000
```
- Run the below command in your terminal to start the server on port 5000
```
npm install -g nodemon
nodemon
```
- Now the backend server will listen to port 5000. Your front end can make API calls to it.