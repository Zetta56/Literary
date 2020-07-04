const express = require("express"),
	  router = express.Router(),
	  middleware = require("../middleware/index"),
	  Piece = require("../models/piece");

router.get("/", async (req, res) => {
	try{
		const max = 12,
			  pageQuery = parseInt(req.query.page),
			  pageNumber = pageQuery ? pageQuery: 1;
		if(req.query.search && req.query.search.length > 0) {
			var searchRe = new RegExp(escapeRegex(req.query.search), "gi"),
				pieces = await Piece.find({title: searchRe}).skip((max * pageNumber) - max).limit(max).exec(),
				matches = await Piece.countDocuments({title: searchRe}).exec();
		} else {
			var pieces = await Piece.find({}).skip((max * pageNumber) - max).limit(max).exec(),
				matches = await Piece.countDocuments().exec();
		};
		res.render("pieces/index", {pieces: pieces, current: pageNumber, pages: Math.ceil(matches / max), search: req.query.search});
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

router.get("/new", middleware.LoggedIn, (req, res) => {
	res.render("pieces/new");
});

router.post("/", middleware.LoggedIn, async (req, res) => {
	try {
		let newPiece = await Piece.create(req.body.piece);
		let tagsArray = req.body.tags.split(",").filter(tag => String(tag).trim());
		newPiece.author.id = req.user._id;
		newPiece.author.username = req.user.username;
		newPiece.tags = tagsArray;
		newPiece.save();
		req.flash("success", "Piece successfully uploaded!");
		res.redirect("/pieces");
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

router.get("/:id", async(req, res) => {
	try {
		let foundPiece = await Piece.findById(req.params.id).populate("comments").exec();
		res.render("pieces/show", {piece: foundPiece});
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

router.get("/:id/edit", async (req, res) => {
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

router.delete("/:id", middleware.AuthorizedPiece, async (req, res) => {
	try {
		await Piece.findByIdAndDelete(req.params.id);
		req.flash("success", "Piece successfully removed.");
		res.redirect("/pieces");
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	}
})

router.get("/:id/likes", middleware.LoggedIn, async (req, res) => {
	try {
		let foundPiece = await Piece.findById(req.params.id);
		let liked = foundPiece.likes.some(like => {
			return like.equals(req.user._id);
		});
		if(liked) {
			await foundPiece.likes.pull(req.user._id);
		} else {
			await foundPiece.likes.push(req.user._id);
		};
		foundPiece.save();
		res.redirect("/pieces");
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports = router;