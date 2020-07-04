var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//ROOT ROUTE
router.get("/", function(req, res) {
	res.render("landing");
});


//======================
//AUTH ROUTES
//======================

//show register form
router.get("/register", function(req, res) {
	res.render("register", {page: 'register'});
});

//handle sign up logic
router.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	if (req.body.adminCode === '111198125') {
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Welcome " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", function(req, res) {
	res.render("login", {page: 'login'});
});

//handling login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res) {	
});

//logout route
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Logged out!");
	res.redirect("/campgrounds");
});

//middleware
//isLoggedIn()

module.exports = router;