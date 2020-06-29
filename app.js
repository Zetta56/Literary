const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  methodOverride = require("method-override"),
	  flash = require("connect-flash"),
	  moment = require("moment"),
	  session = require("express-session"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  passportLocalMongoose = require("passport-local-mongoose");

const Piece = require("./models/piece");

const piecesRoutes = require("./routes/pieces")

require("dotenv").config();
mongoose.connect(process.env.DatabaseURL || "mongodb://localhost/literary", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useFindAndModify", false);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"))
app.use(flash());
app.locals.moment = moment;

app.use(session({
	secret: "Leveling Skill",
	resave: false,
	saveUninitialized: true
}));
app.use((req, res, next) => {
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use("/pieces", piecesRoutes)

app.get("/", (req, res) => {
	res.render("landing");
});

app.listen(process.env.PORT || 3000, () => {
	console.log("Server Started!");
});