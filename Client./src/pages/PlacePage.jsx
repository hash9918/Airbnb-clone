import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../components/BookingWidget";
import PlaceGallery from "../components/PlaceGallery";
import AddressLink from "../components/AddressLink";

function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((res) => {
      setPlace(res.data);
    });
  }, []);
  if (!place) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} />

      <div className="mt-8 grid-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4 ">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place.description}
          </div>
          check-in: {place.checkIn}
          <br />
          check-Out: {place.checkOut}
          <br />
          Max number of guest: {place.maxGuests}
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div>
        <div className="border-2 bg-white border-t shadow-sm p-4 rounded-2xl my-4 mt-2 text-sm text-gray-700 leading-4 ">
          <h2 className=" mb-1 mt-1 font-semibold text-2xl">Extra Info</h2>
          <div className="  text-sm text-gray-700 leading-5">
            {place.extraInfo}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlacePage;
