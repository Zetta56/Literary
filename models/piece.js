const mongoose = require("mongoose");

const pieceSchema = new mongoose.Schema({
	title: String,
	body: String,
	created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Piece", pieceSchema);