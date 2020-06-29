const express = require("express"),
	  app = express(),
	  router = express.Router(),
	  Piece = require("../models/piece");

router.get("/", async (req, res) => {
	const max = 12,
		  pageQuery = parseInt(req.query.page),
		  pageNumber = pageQuery ? pageQuery: 1;
	let pieces = await Piece.find({}).skip((max * pageNumber) - max).limit(max).exec();
	let matches = await Piece.countDocuments().exec();
	res.render("pieces/index", {pieces: pieces, current: pageNumber, pages: Math.ceil(matches / max)});
});

router.get("/new", (req, res) => {
	res.render("pieces/new");
});

router.post("/", async (req, res) => {
	try {
		await Piece.create(req.body.piece);
		req.flash("success", "Piece successfully uploaded!");
		res.redirect("/pieces");
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

router.get("/:id", async(req, res) => {
	try {
		let foundPiece = await Piece.findById(req.params.id);
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

router.put("/:id", async (req, res) => {
	try {
		await Piece.findByIdAndUpdate(req.params.id, req.body.piece);
		req.flash("success", "Piece successfully updated.");
		res.redirect("/pieces/" + req.params.id);
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

router.delete("/:id", async (req, res) => {
	try {
		await Piece.findByIdAndDelete(req.params.id);
		req.flash("success", "Piece successfully removed.")
		res.redirect("/pieces");
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	}
})

module.exports = router;