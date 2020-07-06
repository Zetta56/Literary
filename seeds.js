const mongoose = require("mongoose"),
	  Piece = require("./models/piece"),
	  Comment = require("./models/comment"),
	  User = require("./models/user");

async function seedDB() {
	try {
		await Piece.deleteMany({});
		await Comment.deleteMany({});
		await User.deleteMany({});
		console.log("Resetted Database");
	} catch(err) {
		console.log(err);
	};
};

module.exports = seedDB;