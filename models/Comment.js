const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	post_id: String,
    user_id: String, // (get username and profile picture)
	username: String,
	avatarImage: String,
	text: String,
	timestamp: String,
	likes: Array, // of user ObjectIDs
});

module.exports = mongoose.model("Comment", CommentSchema);