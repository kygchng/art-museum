const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	post_id: String,
    user_id: String, // (get username and profile picture)
	username: String,
	text: String,
	timestamp: String
});

module.exports = mongoose.model("Comment", CommentSchema);