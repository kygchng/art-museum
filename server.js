const express = require("express"); //backend framework
const morgan = require("morgan"); //logger
const helmet = require("helmet"); //makes API requests more secure

const connectDB = require("./db");
const consumer = require("./routes/api/consumer");

const app = express();
const port = 5000;

app.use(express.urlencoded({ extended: false })); //takes in network request and turns it into a JSON
app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // * = give access to anyone (front end app) who calls backend
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS, DELETE'); // these requests are allowed
    next();
});

app.use(morgan("dev"));
app.use(helmet());
connectDB();
app.use("/api/v1/consumer", consumer);

// http://localhost:5000/api/v1/consumer/register/user
// http://localhost:5000/api/v1/consumer/create/room
// http://localhost:5000/api/v1/consumer/create/post
// http://localhost:5000/api/v1/consumer/fetch/rooms
// http://localhost:5000/api/v1/consumer/fetch/room/:roomID
// http://localhost:5000/api/v1/consumer/fetch/user/:userID
// http://localhost:5000/api/v1/consumer/delete/user/:userID
// http://localhost:5000/api/v1/consumer/fetch/posts/:roomID
// http://localhost:5000/api/v1/consumer/fetch/contributors/:roomID
// http://localhost:5000/api/v1/consumer/delete/room/:roomID
// http://localhost:5000/api/v1/consumer/approve/post/:postID
// http://localhost:5000/api/v1/consumer/create/comment
// http://localhost:5000/api/v1/consumer/fetch/comments/:postID
// http://localhost:5000/api/v1/consumer/fetch/unapproved/posts
// http://localhost:5000/api/v1/consumer/increase/likes/:postID/:userID
// http://localhost:5000/api/v1/consumer/decrease/likes/:postID/:userID


app.listen(port, () => console.log(`API server listening on ${port}`)); // ` allows you to pass in variables to the string