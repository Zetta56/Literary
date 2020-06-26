const express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	flash = require("connect-flash"),
	session = require("express-session"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose");

require("dotenv").config();
mongoose.connect(process.env.DatabaseURL || "mongodb://localhost/literary", {useNewUrlParser: true, useUnifiedTopology: true})
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
	res.render("landing");
});

app.get("/literature", (req, res) => {
	res.render("literature/index");
});

app.listen(process.env.PORT || 3000, () => {
	console.log("Server Started!");
});