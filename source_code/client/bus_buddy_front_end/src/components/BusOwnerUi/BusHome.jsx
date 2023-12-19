import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "../../utils/hooks/useAuth.js";
import DeleteAccount from "../../pages/DeleteAccount.jsx";
import ViewBus from "./MyBuses/ViewBus.jsx"
import ViewRoutes from "./MyRoutes/ViewRoutes.jsx"
import ViewTrips from "./MyTrips/ViewTrips.jsx"
import Ownerprofile from "./Ownerprofile.jsx";
import SideBar from "../common/SideBar.jsx";
import "aos/dist/aos.css";
import ViewReviews from "./MyReviews/ViewReviews.jsx";

export default function UserDashboard() {
  const authStatus = useAuthStatus();
  const navigate = useNavigate();


  const [myProfileSelect, setMyProfileSelect] = useState(true);
  const [myBusSelect, setMyBusSelect] = useState(false);
  const [myRouteSelect, setMyRouteSelect] = useState(false);
  const [myTripSelect, setMyTripSelect] = useState(false);
  const [myReviewsSelect, setMyReviewsSelect] = useState(false)
  const [deleteSelect, setDeleteSelect] = useState(false);

  const myProfileSelected = () => {
    setMyProfileSelect(true);
    setMyBusSelect(false);
    setMyRouteSelect(false)
    setMyTripSelect(false);
    setDeleteSelect(false);
    setMyReviewsSelect(false)
  };
  const myBusSelected = () => {
    setMyProfileSelect(false);
    setMyBusSelect(true);
    setMyRouteSelect(false)
    setMyTripSelect(false);
    setDeleteSelect(false);
    setMyReviewsSelect(false)
  };  
  const myRouteSelected = () => {
    setMyProfileSelect(false);
    setMyBusSelect(false);
    setMyRouteSelect(true)
    setMyTripSelect(false);
    setDeleteSelect(false);
    setMyReviewsSelect(false)
  };
  const myTripSelected = () => {
    setMyProfileSelect(false);
    setMyBusSelect(false);
    setMyRouteSelect(false)
    setMyTripSelect(true);
    setDeleteSelect(false);
    setMyReviewsSelect(false)
  };
  const deleteSelected = () => {
    setMyProfileSelect(false);
    setMyBusSelect(false);
    setMyRouteSelect(false)
    setMyTripSelect(false);
    setDeleteSelect(true);
    setMyReviewsSelect(false)
  };
  const myReviewsSelected = () => {
    setMyProfileSelect(false);
    setMyBusSelect(false);
    setMyRouteSelect(false)
    setMyTripSelect(false);
    setDeleteSelect(false);
    setMyReviewsSelect(true)
  }

  const options = [
    // options list  for the sidebar component
    {
      name: " My Profile",
      state: myProfileSelect,
      onChange: myProfileSelected,
    },
    {
      name: "My buses",
      state: myBusSelect,
      onChange: myBusSelected,
    },

    {
      name: "My Routes",
      state: myRouteSelect,
      onChange: myRouteSelected,
    },
    {
      name: "My Trips",
      state: myTripSelect,
      onChange: myTripSelected,
    },
    {
      name: "My Reviews",
      state: myReviewsSelect,
      onChange: myReviewsSelected,
    },
    {
      name: "Delete Account",
      state: deleteSelect,
      onChange: deleteSelected,
    }, 
  ];

  useEffect(() => {
    if (authStatus) {
      if (localStorage.getItem("user_role") !== "3") {
        // if user is not admin redirect to login
        navigate("/login");
      }
    } else {
      navigate("/login"); // if user not logged in redirect to login
    }
  }, [navigate,authStatus]);

  return (
    <div>
      <div>
        <SideBar heading="Bus Owner Profile" options={options} 
        />
      </div>
      <div className="main_content">
        {myProfileSelect && <Ownerprofile/>}
        {myBusSelect && <ViewBus/>}
        {myRouteSelect && <ViewRoutes/>}
        {myTripSelect && <ViewTrips/>}
        {myReviewsSelect && <ViewReviews />}
        {deleteSelect && <DeleteAccount />}
      </div>
    </div>
  );
}

