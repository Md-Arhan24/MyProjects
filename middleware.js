const Listings = require("./models/listing.js");
const Review = require("./models/review.js");
const WrapAsync = require('./utils/wrapAsync.js');
const { listingValidate, reviewValidate ,listingValidateWithId} = require("./schema.js");
const ExpressError = require("./utils/ExpressError");

module.exports.isLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log("login called2");
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "please login!");
    return res.redirect("/login");
  }
  next();
};

//above we store the session , but if the user registerd the passport will clear all sessions.
//to avoid these we have to create another middleware.
module.exports.redirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = WrapAsync(async (req, res, next) => {
  let id = req.params.id;
  let list = await Listings.findById(id);
  if (!list.owner.equals(res.locals.userInfo._id)) {
    req.flash("error", "You dont have permession ");
    return res.redirect(`/listings/${id}`);
  }
  next();
});

module.exports.isAuthor = WrapAsync(async (req, res, next) => {
  let { id, reviewid } = req.params;
  let auth = await Review.findById(reviewid);

  if (!auth.author.equals(res.locals.userInfo._id)) {
    req.flash("error", "You dont have permission!");
    return res.redirect(`/listings/${id}`);
  }
  next();
});

module.exports.validateListing = (req, res, next) => {
  if (!req.body) {
    return next(new ExpressError(400, "Data cant be empty"));
  }
  let { error } = listingValidate.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    console.log(msg);
    return next(error);
  } else {
    next();
  }
};
module.exports.validListingWithId = (req, res, next) => {
  if (!req.body) {
    return next(new ExpressError(400, "Data cant be empty"));
  }
  let { error } = listingValidateWithId.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    console.log(msg);
    return next(error);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewValidate.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    const err = new ExpressError(400, msg);
    return next(err);
  } else {
    next();
  }
};
