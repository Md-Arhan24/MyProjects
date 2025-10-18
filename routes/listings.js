const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
// const upload = multer({storage});
const upload = multer({ storage });


const {
  isLogin,
  isOwner,
  isAuthor,
  validateListing,
  validateReview,
  validListingWithId,
} = require("../middleware.js");
const listingController = require("../controller/listings.js");
const reviewController = require("../controller/review.js");


router.get("/", wrapAsync(listingController.index));

//show route
router.get("/:id", wrapAsync(listingController.showRoute));

//add new listings

router.post(
  "/new",
  isLogin,
  upload.single('image'),
  validateListing,
  wrapAsync(listingController.addNewListings)
);
 
//listing edit route
router.route("/edit/:id")
.get(isLogin,isOwner,wrapAsync(listingController.editListings))
.post(isLogin,isOwner,upload.single('image'),validListingWithId,wrapAsync(listingController.editPostListings));


// listingsdelete route
router.delete(
  "/:id",
  isLogin,
  isOwner,
  wrapAsync(listingController.deleteListings)
);

//req of mountains
router.post('/mountain',listingController.mountain);

//review route
router.post(
  "/:id/review",
  isLogin,
  validateReview,
  wrapAsync(reviewController.addReview)
);
//review delete
router.delete(
  "/:id/review/:reviewid",
  isLogin,
  isAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
