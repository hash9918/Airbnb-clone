const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "place" },
  checkIn: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  checkOut: { type: Date, required: true },
  name: { type: String, required: true },
  mobile: { type: String, require: true },
  price: { type: Number },
});

const BookingModel = mongoose.model("Booking", bookingSchema);

module.exports = BookingModel;
