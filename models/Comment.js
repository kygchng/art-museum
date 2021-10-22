const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user_id: String, // (get username and profile picture)
	text: String,
	timestamp: String
});

module.exports = mongoose.model("Comment", CommentSchema);