var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
app.locals.moment = require('moment');

var path = require('path');
var PORT = process.env.PORT || 5000;

//requiring routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb+srv://akshay:Qwerasdf@cluster0.t6q0o.mongodb.net/yelp?retryWrites=true&w=majority");

app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));	//_method is just conventional to use
app.use(flash());
// seedDB();	//seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Welcome back. You found me!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));	//this comes with the 9th line from user.js
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware (it's added to every single template/route, so currentUser is available to use everywhere)
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;	//req.user is coming from passport(it has the user information)
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));