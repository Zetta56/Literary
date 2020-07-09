const passport = require("passport"),
	  Piece = require("../models/piece"),
	  Comment = require("../models/comment"),
	  User = require("../models/user");

//Initialization
const middleware = {};

//Check If Current User Owns Piece
middleware.AuthorizedPiece = async function(req, res, next) {
	if(req.isAuthenticated()) {
		let foundPiece = await Piece.findById(req.params.id);
		if(foundPiece.author.id.equals(req.user._id)) {
			next();
		} else {
			req.flash("error", "You don't have permission to do that.");
			res.redirect("/pieces/" + req.params.id);
		}
	} else {
		req.session.originalUrl = req.originalUrl;
		req.flash("error", "You must be logged in to do that.");
		res.redirect("/login");
	};
};

//Check If Current User Owns Comment
middleware.AuthorizedComment = async function(req, res, next) {
	if(req.isAuthenticated()) {
		let foundComment = await Comment.findById(req.params.comment_id);
		if(foundComment.author.id.equals(req.user._id)) {
			next();
		} else {
			req.flash("error", "You don't have permission to do that.");
			res.redirect("/pieces/" + req.params.id);
		}
	} else {
		req.session.originalUrl = req.originalUrl;
		req.flash("error", "You must be logged in to do that.");
		res.redirect("/login");
	};
}

//Check If Current User Is The Same As Given User
middleware.AuthorizedUser = async function(req, res, next) {
	if(req.isAuthenticated()) {
		let foundUser = await User.findById(req.params.user_id);
		if(foundUser._id.equals(req.user._id)) {
			next();
		} else {
			req.flash("error", "You don't have permission to do that.");
			res.redirect("/users/" + req.params.user_id);
		}
	} else {
		req.session.originalUrl = req.originalUrl;
		req.flash("error", "You must be logged in to do that.");
		res.redirect("/login");
	};
};

//Check If User Is Logged In
middleware.LoggedIn = function (req, res, next) {
	if(req.isAuthenticated()) {
		next();
	} else {
		req.session.originalUrl = req.originalUrl;
		req.flash("error", "You must be logged in to do that.");
		res.redirect("/login");
	};
};

//Check If User Is Not Logged In
middleware.NotLoggedIn = function (req, res, next) {
	if(!req.isAuthenticated()) {
		next();
	} else {
		req.flash("error", "You are already logged in.");
		res.redirect("/pieces");
	};
};

module.exports = middleware;