const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratagey = require("passport-local");
const User = require("./models/user.js");

const path = require("path");
const { count } = require("console");
const ejsMate = require("ejs-mate");
const {isLogin} = require('./middleware.js');

const method_Override = require("method-override");

const listingRouter = require("./routes/listings.js");
const userRouter = require('./routes/user.js');
const searchRouter = require('./routes/search.js');
const app = express();

//options for express sessions
let store = MongoStore.create({
  mongoUrl:process.env.ATLASDB_URL,
  crypto:{
    secret:process.env.SECRET_KEY,
  },
  touchAfter: 24*3600,//in seconds
});
store.on("error",() =>{
  console.log("error occured in sotre session ",err);
});

let sessionOptions = {
  store,
  secret:process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date() + 3 * 1000 * 60 * 60 * 24, //the diif is expires is from now and maxAge is
    maxAge: 3 * 1000 * 60 * 60 * 24, //after the max age it can be less than expires or more
    httpOnly: true,
  },
};
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagey(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.review = req.flash("review");
  res.locals.notfound = req.flash("notfound");
  res.locals.error = req.flash("error");
  res.locals.userInfo = req.user;
  next();
});

//ejsmate engine setup
app.engine("ejs", ejsMate);
app.use(method_Override("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); //to tell where is view folder when run from outside
app.use(express.static(path.join(__dirname, "public"))); //to tell where is public folder when run from outside

app.use("/listings", listingRouter);
app.use("/search",searchRouter);
app.use('/',userRouter);


app.get("/", (req, res) => {
  res.redirect("/listings");
});
//index route
app.get("/new",isLogin,(req, res) => {
  res.render("listings/new.ejs");
});


app.get("/registerd", async (req, res) => {
  //creating fake user
  const fakeUser = new User({
    email: "arhanmohammed001@gmail.com",
    username: "Arhan Ahmed", //here the mongoose plugin autoadd username field in schema, here we have created username field in userSchema
  });

  let createUser = await User.register(fakeUser, "password123");
  res.send(createUser);
});

//connect to database
const dburl = process.env.ATLASDB_URL;
main()
  .then((res) => {
    console.log("successfully connected");
  })
  .catch((e) => {
    console.log(e);
  });
async function main() {
  try {
    await mongoose.connect(dburl);
  } catch (e) {
    console.log("error occured" + e);
  }
}

//custom middleware
//error handler when some on enter random listing id

app.use((err, req, res, next) => {
  let { statusCode = 404, message } = err;
  res.render("error", { statusCode, message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
