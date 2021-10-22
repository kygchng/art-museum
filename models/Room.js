const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    name: String,
	picture: String, // (link)
	description: String,
	contributors: Array // of user ObjectIds
});

module.exports = mongoose.model("Room", RoomSchema);