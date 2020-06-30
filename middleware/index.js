const passport = require("passport"),
	  Piece = require("../models/piece"),
	  Comment = require("../models/comment"),
	  User = require("../models/user");

const middleware = {};

middleware.AuthorizedPiece = async function(req, res, next) {
	if(req.isAuthenticated()) {
		let foundPiece = await Piece.findById(req.params.id);
		if(foundPiece.author.id.equals(req.user._id)) {
			next();
		} else {
			req.flash("error", "You don't have permission to do that.");
			res.redirect("back");
		}
	} else {
		req.flash("error", "You must be logged in to do that.");
		res.redirect("/login");
	};
};

middleware.AuthorizedComment = async function(req, res, next) {
	if(req.isAuthenticated()) {
		let foundComment = await Comment.findById(req.params.comment_id);
		if(foundComment.author.id.equals(req.user._id)) {
			next();
		} else {
			req.flash("error", "You don't have permission to do that.");
			res.redirect("back");
		}
	} else {
		req.flash("error", "You must be logged in to do that.");
		res.redirect("/login");
	};
}

middleware.LoggedIn = function (req, res, next) {
	if(req.isAuthenticated()) {
		next();
	} else {
		req.flash("error", "You must be logged in to do that.");
		res.redirect("/login");
	};
};

middleware.NotLoggedIn = function (req, res, next) {
	if(!req.isAuthenticated()) {
		next();
	} else {
		req.flash("error", "You are already logged in.");
		res.redirect("/pieces");
	};
};

module.exports = middleware