const Listing = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.index = async (req, res) => {
  let states = await Listing.find({ country: "United States" });
  let dataOthers = await Listing.find({ country: { $ne: "United States" } });

  return res.render("listings/index.ejs", {
    state: "United States",
    states,
    dataOthers,
  });
};

module.exports.showRoute = async (req, res) => {
  let id = req.params.id;

  let one_Data = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  // if (one_Data == null) {
  //   req.flash("notfound", "the listing doesnt exits, sorry !");
  //   res.redirect("/listings");
  // }

  return res.render("listings/show.ejs", { oneData: one_Data });
};

module.exports.addNewListings = async (req, res) => {
  // console.log("8777");
  let url = req.file.path;
  let filename = req.file.filename;
  let data = new Listing(req.body);
  //assign onwer
  data.owner = req.user._id;
  data.image = { url, filename };

  console.log(req.body);
  await data.save();

  req.flash("success", "listing added successfully");
  return res.redirect("/listings");
};

module.exports.editListings = async (req, res) => {
  let id = req.params.id;
  let data = await Listing.findById(id);
  let url = data.image.url.replace("/upload", "/upload/w_200,q_10");
  if (data) {
   return res.render("listings/editForm", { data, url });
  }
};

module.exports.editPostListings = async (req, res) => {
  let data = req.body;
  let id = req.params.id;

  let data_to_update = await Listing.findByIdAndUpdate(id, data);
  if (typeof data_to_update != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    data_to_update.image = { url, filename };
    console.log(data_to_update);
    await data_to_update.save();
  }
  req.flash("success","Updated Successfully!");
  return res.redirect(`/listings/${id}`);
};

module.exports.deleteListings = async (req, res) => {
  let id = req.params.id;
  let data_to_delete = await Listing.findByIdAndDelete(id);
  if (data_to_delete) {
    req.flash("success", "data deleted!");
    return res.redirect("/listings");
  }
};

module.exports.mountain = async (req, res) => {
  let { category } = req.body;
  let states = await Listing.find({
    country: "United States",
    category: category,
  });
  let data = await Listing.find({ category: category })

    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  console.log(data);
  // res.send("data printed");
  res.render("listings/filter.ejs", {
    place: category,
    states,
    dataOthers: data,
  });
};
