const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user_id: String,
	username: String,
	avatarImage: String,
	room_id: String, // → post.find(room_id)
	title: String,
	description: String,
	picture: String, // (link)
	likes: Array, // of user ObjectIds
	//comments: Array, // of comment ObjectIds
	timestamp: String,
	is_approved: Boolean
});

module.exports = mongoose.model("Post", PostSchema);