const mongoose = require("mongoose");
const {Schema} = mongoose;
const review = require('./review');
const { ref } = require("joi");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    url:String,
    filename:String,
  },
  price: {
    type: Number,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  reviews:[
    { //here we have to define types and other schema things into object {} not outside of it my mistake.
      type: Schema.Types.ObjectId,
      ref:"Review"

    }

  ],
  owner :{
    //wanted to store the id of user
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  category:{
    type:String,
    enum:["mountain","local","city","farm","beach","nature"],

  }
});

listingSchema.post('findOneAndDelete',async (data) => {
    if(data){
      await review.deleteMany({_id : {$in: data.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);



module.exports = Listing;
