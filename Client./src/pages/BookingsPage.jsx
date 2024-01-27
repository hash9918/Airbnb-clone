import React, { useEffect, useState } from "react";
import AccountNav from "../components/AccountNav";
import axios from "axios";
import PlaceImg from "../components/PlaceImg";
import BookingDates from "../components/BookingDates";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("/bookings").then((res) => {
      setBookings(res.data);
    });
  }, []);
  return (
    <div>
      <AccountNav />
      <div className="grid gap-4">
        {bookings?.length > 0 &&
          bookings.map((booking) => {
            return (
              <Link
                to={"/account/bookings/" + booking._id}
                className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden"
              >
                <div className="w-48 ">
                  <PlaceImg place={booking.place} />
                </div>
                <div className="py-1 pr-3 grow">
                  <h2 className="text-xl">{booking.place.title}</h2>
                  <BookingDates booking={booking} />
                  <div className="text-xl mt-1 flex gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                      />
                    </svg>
                    {differenceInCalendarDays(
                      new Date(booking.checkOut),
                      new Date(booking.checkIn)
                    )}{" "}
                    Nights
                  </div>
                  <div className="flex mt-1 gap-1">
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Total Price: ${booking.price}
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

export default BookingsPage;
