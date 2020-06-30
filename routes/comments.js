const express = require("express"),
	  router = express.Router({mergeParams: true}),
	  middleware = require("../middleware/index"),
	  Piece = require("../models/piece"),
	  Comment = require("../models/comment");

router.post("/", middleware.LoggedIn, async (req,res) => {
	try {
		let foundPiece = await Piece.findById(req.params.id);
		let newComment = await Comment.create(req.body.comment);
		newComment.author.id = req.user._id;
		newComment.author.username = req.user.username;
		newComment.save();
		foundPiece.comments.push(newComment);
		foundPiece.save()
		req.flash("success", "Comment successfully added.");
		res.redirect("/pieces/" + req.params.id);
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

router.post("/:comment_id", middleware.AuthorizedComment, async (req, res) => {
	try {
		await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
		req.flash("success", "Comment successfully updated.");
		res.redirect("/pieces/" + req.params.id);
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
})

router.delete("/:comment_id", middleware.AuthorizedComment, async (req, res) => {
	try {
		await Comment.findByIdAndDelete(req.params.comment_id);
		req.flash("success", "Comment successfully removed.");
		res.redirect("/pieces/" + req.params.id);
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	}
})

module.exports = router;