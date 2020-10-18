const express = require("express"),
	  router = express.Router(),
	  mongoose = require("mongoose"),
	  middleware = require("../middleware/index"),
	  Piece = require("../models/piece"),
	  User = require("../models/user"),
	  Comment = require("../models/comment"),
	  Notification = require("../models/notification");

//Index Route
router.get("/", async (req, res) => {
	try{
		//Pagination Variables
		const max = 12,
			  pageQuery = parseInt(req.query.page),
			  pageNumber = pageQuery ? pageQuery: 1;
		if(req.query.search && req.query.search.length > 0) {
			//Search Logic
			var searchRe = new RegExp(escapeRegex(req.query.search), "gi"),
				pieces = await Piece.find({$or: [{title: searchRe}, {tags: searchRe}]}).sort({likes: "desc"}).skip((max * pageNumber) - max).limit(max).exec(),
				matches = await Piece.countDocuments({$or: [{title: searchRe}, {tags: searchRe}]}).exec();
		} else {
			var pieces = await Piece.find({}).sort({likes: "desc"}).skip((max * pageNumber) - max).limit(max).exec(),
				matches = await Piece.countDocuments().exec();
		};
		res.render("pieces/index", {pieces: pieces, current: pageNumber, pages: Math.ceil(matches / max), search: req.query.search});
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

//New Route
router.get("/new", middleware.LoggedIn, (req, res) => {
	res.render("pieces/new");
});
router.post("/", middleware.LoggedIn, async (req, res) => {
	try {
		let newPiece = await Piece.create(req.body.piece);
		//Make sure tag isn't empty
		let tagsArray = req.body.tags.split(",").filter(tag => String(tag).trim());
		//Edit nested properties in newPiece
		newPiece.author.id = req.user._id;
		newPiece.author.username = req.user.username;
		newPiece.tags = tagsArray;
		newPiece.save();
		//Notification Logic
		let author = await User.findById(req.user._id).populate("followers").exec();
		if(author.followers.length > 0) {
			let newNotification = await Notification.create({
				author: req.user.username,
				pieceId: newPiece._id,
				notificationType: "Piece"
			});
			author.followers.forEach(follower => {
				follower.notifications.push(newNotification);
				follower.save();
			});
		};
		req.flash("success", "Piece successfully uploaded!");
		res.redirect("/pieces");
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

//Show Route
router.get("/:id", async(req, res) => {
	try {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
			req.flash("error", "Piece could not be found.");
			return res.redirect("/pieces");
		};
		let foundPiece = await Piece.findById(req.params.id).populate({path: "comments", populate: {path: "author.id"}}).exec();
		if(!foundPiece) {
			req.flash("error", "Piece could not be found.");
			return res.redirect("/pieces");
		};
		res.render("pieces/show", {piece: foundPiece});
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

//Edit Routes
router.get("/:id/edit", middleware.AuthorizedPiece, async (req, res) => {
	try {
		let foundPiece = await Piece.findById(req.params.id);
		res.render("pieces/edit", {piece: foundPiece});
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});
router.put("/:id", middleware.AuthorizedPiece, async (req, res) => {
	try {
		let updatedPiece = await Piece.findByIdAndUpdate(req.params.id, req.body.piece);
		//Make sure tag isn't empty & save it
		let tagsArray = req.body.tags.split(",").filter(tag => String(tag).trim());
		updatedPiece.tags = tagsArray;
		updatedPiece.save();
		req.flash("success", "Piece successfully updated.");
		res.redirect("/pieces/" + req.params.id);
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

//Delete Route
router.delete("/:id", middleware.AuthorizedPiece, async (req, res) => {
	try {
		let foundPiece = await Piece.findById(req.params.id);
		let foundNotifications = await Notification.find({"comment.id": {$in: foundPiece.comments}});
		if(foundNotifications.length > 0) {
			await Notification.deleteMany({"comment.id": {$in: foundPiece.comments}});
		};
		await Comment.deleteMany({_id: {$in: foundPiece.comments}});
		await Piece.deleteOne(foundPiece);
		req.flash("success", "Piece successfully removed.");
		res.redirect("/pieces");
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

//Likes Route
router.get("/:id/likes", middleware.LoggedIn, async (req, res) => {
	try {
		let foundPiece = await Piece.findById(req.params.id);
		//Check if current user liked piece already
		let liked = foundPiece.likes.some(like => {
			return like.equals(req.user._id);
		});
		if(liked) {
			//Unlike
			await foundPiece.likes.pull(req.user._id);
			req.flash("error", "Unliked '" + foundPiece.title + "'");
		} else {
			//Like
			await foundPiece.likes.push(req.user._id);
			req.flash("success", "Liked '" + foundPiece.title + "'");
		};
		foundPiece.save();
		res.redirect("back");
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

//Escape Special Characters
function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports = router;