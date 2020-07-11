const express = require("express"),
	  router = express.Router({mergeParams: true}),
	  middleware = require("../middleware/index"),
	  Piece = require("../models/piece"),
	  Comment = require("../models/comment"),
	  User = require("../models/user"),
	  Notification = require("../models/notification");

//New Route
router.post("/", middleware.LoggedIn, async (req,res) => {
	try {
		let foundPiece = await Piece.findById(req.params.id);
		let newComment = await Comment.create(req.body.comment);
		//Edit nested properties in newComment
		newComment.author.id = req.user._id;
		newComment.author.username = req.user.username;
		newComment.save();
		foundPiece.comments.push(newComment);
		foundPiece.save()
		//Notification Logic
		let author = await User.findById(req.user._id).populate("followers").exec();
		if(author.followers.length > 0) {
			let newNotification = await Notification.create({
				author: req.user.username,
				notificationType: "Comment"
			})
			//Edit nested properties in notification
			newNotification.comment.id = newComment._id;
			newNotification.comment.matchingPiece = req.params.id;
			newNotification.save();
			author.followers.forEach(follower => {
				follower.notifications.push(newNotification);
				follower.save();
			});
		};
		req.flash("success", "Comment successfully added.");
		res.redirect("/pieces/" + req.params.id);
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

//Edit Route
router.put("/:comment_id", middleware.AuthorizedComment, async (req, res) => {
	try {
		await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
		req.flash("success", "Comment successfully updated.");
		res.redirect("/pieces/" + req.params.id);
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
})

//Delete Route
router.delete("/:comment_id", middleware.AuthorizedComment, async (req, res) => {
	try {
		await Notification.deleteOne({"comment.id": {$in: req.params.comment_id}});
		await Comment.findByIdAndDelete(req.params.comment_id);
		req.flash("success", "Comment successfully removed.");
		res.redirect("/pieces/" + req.params.id);
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	}
})

module.exports = router;