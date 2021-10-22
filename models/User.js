const mongoose = require("mongoose"); //external API
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String, // (TBD - Auth0)
	password: String, // (TBD - Auth0)
	username: String,
	birthday: String, // (MM/DD/YYYY)
	bio: String, // (Artist description)
	profile_picture: String, // (link)
	is_admin: Boolean,
	rooms: Array, // of room ObjectIds that the user has posted to (updated for each post)
	posts: Array, // of post ObjectIds
});

module.exports = mongoose.model("User", UserSchema);