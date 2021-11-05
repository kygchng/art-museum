const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    name: String,
	picture: String, // (link)
	description: String,
	posts: Array, // of post ObjectIds
	contributors: Array, // of user ObjectIds
    creator: String //userID, must be admin to create room
});

module.exports = mongoose.model("Room", RoomSchema);