import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../components/AddressLink";
import PlaceGallery from "../components/PlaceGallery";
import BookingDates from "../components/BookingDates";

function Booking() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  useEffect(() => {
    axios.get("/bookings").then((res) => {
      const foundBooking = res.data.find(({ _id }) => _id === id);
      if (foundBooking) {
        setBooking(foundBooking);
      }
    });
  }, []);
  if (!booking) {
    return "";
  }
  return (
    <div className="my-8">
      <h1 className="text-3xl"> {booking.place.title}</h1>
      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="flex justify-between bg-gray-200 p-6 my-6 rounded-2xl ">
        <div>
          {" "}
          <h2 className="text-xl mb-2">Your booking information</h2>
          <BookingDates booking={booking} />
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl ">
          <div>Total Price :</div>

          <div className="text-3xl">{booking.price}</div>
        </div>
      </div>

      <PlaceGallery place={booking.place} />
    </div>
  );
}

export default Booking;
