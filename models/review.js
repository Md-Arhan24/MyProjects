const mongoose = require("mongoose");
const { Schema } = mongoose; //dont write mongoose.Schema as we extracted Schema from mongoose

//defing review schema
const reviewSchema = new Schema({
  comment: {
    type: String,
    minlength: 30,
  },
  range: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

//exporting the modle
module.exports = mongoose.model("Review", reviewSchema);
