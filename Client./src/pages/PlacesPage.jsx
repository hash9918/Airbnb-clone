import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import axios from "axios";
import PlaceImg from "../components/PlaceImg";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  //here we will use useeffect to pull the data from the db when the page loads for the first time only as when we will add the data then we will leave the page
  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      {/* depricated */}
      {/* if we don't have new in url then only render this  */}

      <div className="text-center">
        list of all added places
        <br />
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full "
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new places
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 &&
          places.map((place, id) => {
            return (
              <Link
                key={id}
                to={"/account/places/" + place._id}
                className=" mt-3 cursor-pointer flex gap-4 bg-gray-100 p- rounded-2xl"
              >
                <div className="w-32 h-32  flex shrink-0  bg-gray-300">
                  <PlaceImg place={place} />
                </div>
                <div className="grow-0 shrink">
                  <h2 className="text-xl "> {place.title}</h2>
                  <p className="text-sm mt-2">{place.description}</p>
                </div>
              </Link>
            );
          })}
      </div>

      {/* depricated */}
      {/* if we have new in url after places then add a form to add about the place */}
      {/* {action === "new" && <PlacesFormPage />} */}
    </div>
  );
}
