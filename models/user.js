const mongoose = require("mongoose"),
	  passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	avatar: {type: String, default: "/images/defaultAvatar.jpg"},
	username: String,
	password: String,
	saves: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Piece"
		}
	],
	followers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	],
	notifications: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Notification"
		}
	]
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);