const express = require("express"),
	  router = express.Router(),
	  middleware = require("../middleware/index"),
	  Piece = require("../models/piece"),
	  User = require("../models/user"),
	  Notification = require("../models/notification");

//Index Route
router.get("/", middleware.LoggedIn, async (req, res) => {
	try {
		//Populate notifications
		let foundUser = await User.findById(req.user._id).
							  populate({path: "notifications", populate: {path: "pieceId"}}).
							  populate({path: "notifications", populate: {path: "comment.id"}}).
							  exec();
		let notificationsExtras = foundUser.notifications.reverse();
		//Find followed users
		let followedUsers = await User.find({followers: {$in: [req.user._id]}});
		res.render("notifications", {notificationsEx: notificationsExtras, followedUsers});
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

//Show Route
router.get("/:id", middleware.LoggedIn, async (req, res) => {
	try {
		let foundNotification = await Notification.findById(req.params.id);
		//Make notification inactive
		foundNotification.isRead = true;
		foundNotification.save();
		res.redirect("/pieces/" + (foundNotification.pieceId || foundNotification.comment.matchingPiece));
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

//Delete Route
router.delete("/:id", middleware.LoggedIn, async(req, res) => {
	try {
		let foundUser = await User.findById(req.user._id);
		let foundNotification = await Notification.findById(req.params.id);
		//Remove notification ObjectId from user
		User.findByIdAndUpdate(req.user._id, {$pull: {notifications: req.params.id}}, {"new": true}, function(err, result) {});
		//Delete notification from DB if noone has notification anymore
		let lastNotified = await User.find({"notifications": {$in: [foundNotification]}});
		if(lastNotified.length === 0) {
			foundNotification.delete();
		};
		req.flash("success", "Notification successfully removed.");
		res.redirect("/notifications");
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
})

module.exports = router;