import React, { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays, set } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookPlace(ev) {
    ev.preventDefault();

    const { data } = await axios.post("/bookings", {
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      mobile,
      price: numberOfNights * place.price,
      place: place._id,
    });
    const bookingId = data._id;
    setRedirect("/account/bookings/" + bookingId);
  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <div className="border-2 bg-white  shadow-sm p-4 rounded-2xl ">
        <div className="text-2xl text-center mb-1">
          Price: {place.price ? place.price : 0} / per night
        </div>
        <div className="border-2 rounded-2xl mt-4">
          <div className="flex">
            <div className=" px-3 py-4  ">
              <label>Check in:</label>
              <input
                value={checkIn}
                onChange={(ev) => setCheckIn(ev.target.value)}
                type="date"
              />
            </div>
            <div className=" px-3 py-4 border-t ">
              <label>Check Out:</label>
              <input
                value={checkOut}
                onChange={(ev) => setCheckOut(ev.target.value)}
                type="date"
              />
            </div>
          </div>
          <div className=" px-3 py-4 border-t ">
            <label>Number of Guests</label>
            <input
              value={numberOfGuests}
              onChange={(ev) => setNumberOfGuests(ev.target.value)}
              type="number"
            />
          </div>
          {numberOfNights > 0 && (
            <div className=" px-3 py-4 border-t ">
              <label>Your Full Name: </label>
              <input
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                type="text"
              />
              <label>Phone Number </label>
              <input
                value={mobile}
                onChange={(ev) => setMobile(ev.target.value)}
                type="tel"
              />
            </div>
          )}
        </div>
        <button onClick={bookPlace} className="primary">
          Book this place $
          {numberOfNights && <span>{numberOfNights * place.price}</span>}
        </button>
      </div>
    </div>
  );
}

export default BookingWidget;
