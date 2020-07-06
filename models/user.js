const mongoose = require("mongoose"),
	  passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	avatar: {type: String, default: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-photo-183042379.jpg"},
	username: String,
	password: String,
	saves: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Piece"
		}
	]
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);