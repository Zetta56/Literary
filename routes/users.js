const express = require("express"),
	  router = express.Router({mergeParams: true}),
	  middleware = require("../middleware/index"),
	  Piece = require("../models/piece"),
	  User = require("../models/user");

router.get("/", async (req, res) => {
	try {
		const max = 10,
			  pageQuery = parseInt(req.query.page),
			  pageNumber = pageQuery ? pageQuery : 1;
		let foundPieces = await Piece.find({"author.id": {$in: [req.params.user_id]}}).skip((max * pageNumber) - max).limit(max).exec();
		let matches = await Piece.countDocuments({"author.id": {$in: [req.params.user_id]}}).exec();
		let foundUser = await User.findById(req.params.user_id);
		res.render("users/show", {user: foundUser, pieces: foundPieces, current: pageNumber, pages: Math.ceil((matches / max))});
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

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
		foundUser.avatar = req.body.avatar;
		foundUser.save();
		req.flash("success", "Avatar successfully updated.");
		res.redirect("/users/" + req.params.user_id);
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	}
});

module.exports = router;