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
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Piece", pieceSchema);