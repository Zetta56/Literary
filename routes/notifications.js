const express = require("express"),
	  router = express.Router(),
	  middleware = require("../middleware/index"),
	  Piece = require("../models/piece"),
	  User = require("../models/user"),
	  Notification = require("../models/notification");

router.get("/", middleware.LoggedIn, async (req, res) => {
	try {
		let foundUser = await User.findById(req.user._id).
							  populate({path: "notifications", populate: {path: "pieceId"}}).
							  populate({path: "notifications", populate: {path: "comment.id"}}).
							  exec();
		let notificationsExtras = foundUser.notifications.reverse();
		let followedUsers = await User.find({followers: {$in: [req.user._id]}});
		res.render("notifications", {notificationsEx: notificationsExtras, followedUsers});
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

router.get("/:id", middleware.LoggedIn, async (req, res) => {
	try {
		let foundNotification = await Notification.findById(req.params.id);
		foundNotification.isRead = true;
		foundNotification.save();
		res.redirect("/pieces/" + (foundNotification.pieceId || foundNotification.comment.matchingPiece));
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

router.delete("/:id", middleware.LoggedIn, async(req, res) => {
	try {
		let foundUser = await User.findById(req.user._id);
		let foundNotification = await Notification.findById(req.params.id);
		User.findByIdAndUpdate(req.user._id, {$pull: {notifications: req.params.id}}, {"new": true}, function(err, result) {});
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