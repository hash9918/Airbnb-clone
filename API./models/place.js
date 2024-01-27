const Mongoose = require("mongoose");

const placeSchema = new Mongoose.Schema({
  owner: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  address: String,
  photos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: Number,
  checkOut: Number,
  maxGuests: Number,
  price: Number,
});

const PlaceModel = Mongoose.model("place", placeSchema);

module.exports = PlaceModel;
