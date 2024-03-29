import React, { useState } from "react";

function PlaceGallery({ place }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black text-white">
        <div className="bg-black p-8 grid gap-4">
          <div>
            <h2 className="text-3xl mr36">Photos of {place.title}</h2>
            <button
              onClick={() => {
                setShowAllPhotos(false);
              }}
              className="right-8 top-9 shadow shadow-black-500 fixed py-2 px-4 rounded-3xl "
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {place?.photos?.length > 0 &&
            place.photos.map((photo) => (
              <div>
                <img src={"http://localhost:4000/uploads/" + photo} alt="" />
              </div>
            ))}
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="relative">
        <div className="rounded-3xl overflow-hidden grid gap-2 grid-cols-[2fr_1fr]">
          <div>
            {place.photos?.[0] && (
              <div>
                <img
                  onClick={() => setShowAllPhotos(true)}
                  className="cursor-pointer aspect-square object-cover
                "
                  src={"http://localhost:4000/uploads/" + place.photos[0]}
                  alt=""
                />
              </div>
            )}
          </div>
          <div className="grid gap-2">
            {place.photos?.[1] && (
              <img
                onClick={() => setShowAllPhotos(true)}
                className="cursor-pointer aspect-square object-cover
                "
                src={"http://localhost:4000/uploads/" + place.photos[1]}
                alt=""
              />
            )}
            {place.photos?.[2] && (
              <img
                onClick={() => setShowAllPhotos(true)}
                className="cursor-pointer aspect-square relative object-cover
                "
                src={"http://localhost:4000/uploads/" + place.photos[2]}
                alt=""
              />
            )}
          </div>
        </div>
        <button
          onClick={() => setShowAllPhotos(true)}
          className="flex gap-1 bg-white rounded-2xl shadow-md shadow-gray-500 py-2 px-2 absolute bottom-2 right-2"
        >
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
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>{" "}
          show more photos
        </button>
      </div>
    </div>
  );
}

export default PlaceGallery;
