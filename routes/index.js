const express = require("express"),
	  router = express.Router(),
	  passport = require("passport"),
	  middleware = require("../middleware/index"),
	  Piece = require("../models/piece"),
	  Comment = require("../models/comment"),
	  User = require("../models/user");

//Landing Route
router.get("/", (req, res) => {
	res.render("landing");
});

//Register Routes
router.get("/register", middleware.NotLoggedIn, (req, res) => {
	res.render("register");
});
router.post("/register", middleware.NotLoggedIn, async (req, res) => {
	try {
		//Email Validation
		if(!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(req.body.email)) {
			req.flash("error", "Email is not valid.");
			return res.redirect("back");
		};
		//Password Validation
		if(!/^((?=.*\d)(?=.*[\W]).{6,})$/g.test(req.body.password)) {
			req.flash("error", "Password must be 6+ characters long and contain least 1 number and special character.");
			return res.redirect("back");
		};
		//Create new user
		let user = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			username: req.body.username
		});
		await User.register(user, req.body.password);
		//Log user in
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "You have successfully registered for Literary!");
			res.redirect("/pieces");
		})	
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

//Login Routes
router.get("/login", middleware.NotLoggedIn, (req, res) => {
	res.render("login");
});
router.post("/login", middleware.NotLoggedIn, passport.authenticate("local", {
	//Passport middleware's flash and redirect
	successFlash: "You have successfully logged in.",
	failureRedirect: "back",
	failureFlash: true
}), (req, res) => {
	res.redirect(req.session.originalUrl || "/pieces");
});

//Logout Route
router.get("/logout", middleware.LoggedIn, async (req, res) => {
	try {
		await req.session.destroy();
		res.redirect("/pieces");
	} catch(err) {
		req.flash("error", err.message);
		res.redirect("back");
	};
});

//Missing Page Route
router.get("*", (req, res) => {
	res.render("missing");
});

module.exports = router;