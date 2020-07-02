const mongoose = require("mongoose");

const pieceSchema = new mongoose.Schema({
	title: String,
	body: String,
	image: String,
	type: String,
	tags: [
		{type: String}
	],
	created: {type: Date, default: Date.now},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	]
});

module.exports = mongoose.model("Piece", pieceSchema);