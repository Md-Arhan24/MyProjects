const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.addReview = async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);
  let review1 = new Review(req.body);

  review1.author = req.user._id;

  listing.reviews.push(review1);

  await review1.save();
  await listing.save();
  req.flash("success", "review added successfully");

  return res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewid } = req.params;
  //here pull means delete or remove 
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  req.flash("success", "review deleted!");
  return res.redirect(`/listings/${id}`);
};
