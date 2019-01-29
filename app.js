const express         = require("express"),
      app             = express(),
      bodyParser      = require("body-parser"),
      methodOverride  = require("method-override"),
      passport        = require('passport'),
      LocalStrategy   = require('passport-local'),
      flash           = require('connect-flash'),
      mongoose        = require("mongoose"),
      Schema          = mongoose.Schema,
      Report          = require('./models/reports'),
      Announcement    = require('./models/announcements'),
      User            = require('./models/users'),
      News            = require('./models/news'),
      Comment         = require('./models/comments');


// ========================================


// MONGOOSE SETTINGS
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost/USDT", {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});


// =======================================


//APP SETTINGS & CONFIG

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine","ejs");
app.locals.moment = require('moment');

// ======================================

// PASSPORT CONFIGURATION

app.use(require("express-session")({
  secret: "The truth is not the truth!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next){
 res.locals.currentUser = req.user;
 res.locals.error = req.flash("error");
 res.locals.success = req.flash("success");
 next();
});


// =======================================


//ROUTES

var indexRoutes         = require('./routes/index'),
    reportRoutes        = require('./routes/reports'),
    announcementRoutes  = require('./routes/announcements'),
    newsRoutes          = require('./routes/news')
    commentRoutes       = require('./routes/comments'),
    authRoutes          = require('./routes/auth');

app.use(reportRoutes);
app.use(announcementRoutes);
app.use(newsRoutes);
app.use(commentRoutes);
app.use(authRoutes);
app.use(indexRoutes);



// =======================================


//LISTENING ON PORT
app.listen(3000, function(){
  console.log("listening");
});