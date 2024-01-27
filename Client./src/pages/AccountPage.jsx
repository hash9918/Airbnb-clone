import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../components/AccountNav";

function AccountPage() {
  const { user, ready, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);

  if (!ready) {
    return "...loading";
  }
  if (ready && !user) {
    return <Navigate to={"/login"} />;
  }
  //nested routeing
  let { subpage } = useParams();
  //bcuz the /account/ will be for profile and opened by defualt therefore no extra params after the /account
  if (subpage === undefined) {
    subpage = "profile";
  }

  //function to logout just by deleting the cookie when button is clicked
  async function logout() {
    await axios.post("/logout");
    setUser(null);
    setRedirect("/login");
  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <AccountNav />

      {/* here it means if we have 3000/account/profile then this will be rendered if it is 3000/account/boookings then it will not be rendered  */}
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name}({user.email})<br />
          <button onClick={logout} className="primary max-w-sm">
            logout
          </button>
        </div>
      )}
      {/* if the url is of type 3000/account/places then my accomodation will be selected and the places page will be rendered */}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
}

export default AccountPage;
