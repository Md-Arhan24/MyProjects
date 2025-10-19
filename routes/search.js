const Listings = require("../models/listing");
const express = require("express");
const WrapAsync = require('../utils/wrapAsync');
const router = express.Router();

router.post("/",WrapAsync(async (req, res) => {
  let { place } = req.body;
  let data = await Listings.find({ location: place })
    .populate({ path: "reviews", populate: { path : "author" } })
    .populate({ path: "owner" });
  res.render('listings/search.ejs',{dataOthers : data});
}));

module.exports = router;
