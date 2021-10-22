const mongoose = require("mongoose"); //external API that lets you talk to mongodb

const URI = "mongodb+srv://kylie:hello123@cluster0.wwwns.mongodb.net/art-museum?retryWrites=true&w=majority";

const connectDB = async () => {
    await mongoose.connect(URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    console.log("MongoDB is successfully connected!");
}

module.exports = connectDB; //access JS functions from one file to another 
