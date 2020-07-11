const express = require("express"),
	  router = express.Router({mergeParams: true}),
	  mongoose = require("mongoose"),
	  middleware = require("../middleware/index"),
	  Piece = require("../models/piece"),
	  User = require("../models/user");

//Show Route
router.get("/", async (req, res) => {
	try {
		if(!mongoose.Types.ObjectId.isValid(req.params.user_id)) {
			req.flash("error", "User could not be found.");
			return res.redirect("/pieces");
		};
		//Pagination Variables
		const max = 10,
			  pageQuery = parseInt(req.query.page),
			  pageNumber = pageQuery ? pageQuery : 1;
		let foundPieces = await Piece.find({"author.id": {$in: [req.params.user_id]}}).skip((max * pageNumber) - max).limit(max).exec();
		let matches = await Piece.countDocuments({"author.id": {$in: [req.params.user_id]}}).exec();
		let foundUser = await User.findById(req.params.user_id);
		if(!foundUser) {
			req.flash("error", "User could not be found.");
			return res.redirect("/pieces");
		};
		res.render("users/show", {user: foundUser, pieces: foundPieces, current: pageNumber, pages: Math.ceil((matches / max))});
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

//Edit Routes
router.get("/edit", middleware.AuthorizedUser, async (req, res) => {
	try {
		let foundUser = await User.findById(req.params.user_id);
		res.render("users/edit", {user: foundUser});
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
})
router.put("/",  middleware.AuthorizedUser, async (req, res) => {
	try {
		//Email Validation
		if(!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(req.body.user.email)) {
			req.flash("error", "Email is not valid.");
			return res.redirect("back");
		};
		//Edit entire user
		await User.findByIdAndUpdate(req.params.user_id, req.body.user);
		req.flash("success", "Profile successfully updated.");
		res.redirect("/users/" + req.params.user_id);
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	}
})
router.put("/avatar", middleware.AuthorizedUser, async (req, res) => {
	try {
		let foundUser = await User.findById(req.params.user_id);
		//Edit user's avatar
		foundUser.avatar = req.body.avatar;
		foundUser.save();
		req.flash("success", "Avatar successfully updated.");
		res.redirect("/users/" + req.params.user_id);
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	}
});

//Saves Routes
router.get("/saves", middleware.LoggedIn, async (req, res) => {
	try {
		let foundUser = await User.findById(req.params.user_id).populate("saves").exec();
		res.render("users/saves", {user: foundUser});
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});
router.get("/saves/:id", middleware.LoggedIn, async (req, res) => {
	try {
		let foundPiece = await Piece.findById(req.params.id);
		let foundUser = await User.findById(req.params.user_id);
		//Check if current user saved piece already
		let saved = foundUser.saves.some(save => {
			return save.equals(foundPiece._id);
		});
		if(saved) {
			//Unsave
			await foundUser.saves.pull(foundPiece._id);
			req.flash("error", "Unsaved '" + foundPiece.title + "'");
		} else {
			//Save
			await foundUser.saves.push(foundPiece._id);
			req.flash("success", "Saved '" + foundPiece.title + "'");
		};
		foundUser.save();
		res.redirect("back");
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

//Follow Route
router.post("/follow", middleware.LoggedIn, async (req, res) => {
	try {
		let foundUser = await User.findById(req.params.user_id);
		//Check if current user is foundUser
		if(foundUser._id.equals(req.user._id)) {
			req.flash("error", "You can't follow yourself.");
			return res.redirect("/users/" + req.params.user_id)
		}
		//Check if current user followed foundUser already
		let followed = foundUser.followers.some(follower => {
			return follower.equals(req.user._id);
		});
		if(followed) {
			//Unfollow
			await foundUser.followers.pull(req.user._id);
			req.flash("error", "Unfollowed '" + foundUser.username + "'");
		} else {
			//Follow
			await foundUser.followers.push(req.user._id);
			req.flash("success", "Followed '" + foundUser.username + "'");
		};
		foundUser.save();
		res.redirect("back");
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

module.exports = router;