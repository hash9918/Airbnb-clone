import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function IndexPage() {
  //in axios we have to use promises as it doesnt support async await
  //this is to load all the places saved in db
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then((resp) => {
      setPlaces(resp.data);
    });
  }, []);

  return (
    <div className="mt-8 grid gap-6 gap-x-6 gap-y-8 grid-col-2 md:grid-cols-3 lg:grid-cols-4">
      {/* when click on each place go to placepagep */}
      {places.length > 0 &&
        places.map((place) => (
          <Link to={"/place/" + place._id}>
            <div className="bg-gray-500 max-w-max mb-2   rounded-2xl flex">
              {place.photos?.[0] && (
                <img
                  className="rounded-2xl  aspect-square"
                  src={"http://localhost:4000/uploads/" + place.photos?.[0]}
                  alt=""
                />
              )}
            </div>
            <h3 className="font-bold">{place.address}</h3>

            <h2 className="text-sm  text-gray-500"> {place.title}</h2>
            <div className="mt-1">
              <span className="font-bold">
                ₹{place.price ? place.price : 0}
              </span>{" "}
              per night
            </div>
          </Link>
        ))}
    </div>
  );
}

export default IndexPage;
