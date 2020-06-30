const express = require("express"),
	  router = express.Router(),
	  passport = require("passport"),
	  middleware = require("../middleware/index"),
	  Piece = require("../models/piece"),
	  Comment = require("../models/comment"),
	  User = require("../models/user");

router.get("/", (req, res) => {
	res.render("landing");
});

router.get("/register", middleware.NotLoggedIn, (req, res) => {
	res.render("register");
});

router.post("/register", middleware.NotLoggedIn, async (req, res) => {
	try {
		let user = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			username: req.body.username
		});
		await User.register(user, req.body.password);
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "You have successfully registered for Literary!");
			res.redirect("/pieces");
		})
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

router.get("/login", middleware.NotLoggedIn, (req, res) => {
	res.render("login");
});

router.post("/login", middleware.NotLoggedIn, passport.authenticate("local", {
	successRedirect: "/pieces",
	successFlash: "You have successfully logged in.",
	failureRedirect: "back",
	failureFlash: true
}), (req, res) => {
});

router.get("/logout", middleware.LoggedIn, (req, res) => {
	try {
		req.logout();
		req.flash("success", "You have successfully logged out.");
		res.redirect("/pieces");
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

module.exports = router;