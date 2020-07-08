const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
	author: String,
	pieceId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Piece"
	},
	comment: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		},
		matchingPiece: String
	},
	notificationType: String,
	isRead: {type: Boolean, default: false}
});

module.exports = mongoose.model("Notification", notificationSchema);