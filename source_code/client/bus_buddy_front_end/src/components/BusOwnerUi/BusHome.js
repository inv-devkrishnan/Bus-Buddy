import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "../../utils/hooks/useAuth";
import DeleteAccount from "../../pages/DeleteAccount";
import ViewBus from "./Mybuses/ViewBus"
import ViewRoutes from "../BusOwnerUi/MyRoutes/ViewRoutes"
import ViewTrips from "./MyTrips/ViewTrips.jsx"
import Ownerprofile from "./Ownerprofile";
import SideBar from "../common/SideBar";

export default function UserDashboard() {
  const authStatus = useAuthStatus();
  const navigate = useNavigate();

  const [myProfileSelect, setMyProfileSelect] = useState(true);
  const [myBusSelect, setMyBusSelect] = useState(false);
  const [myRouteSelect, setMyRouteSelect] = useState(false);
  const [myTripSelect, setMyTripSelect] = useState(false);
  const [deleteSelect, setDeleteSelect] = useState(false);

  const myProfileSelected = () => {
    setMyProfileSelect(true);
    setMyBusSelect(false);
    setMyRouteSelect(false)
    setMyTripSelect(false);
    setDeleteSelect(false);
  };
  const myBusSelected = () => {
    setMyProfileSelect(false);
    setMyBusSelect(true);
    setMyRouteSelect(false)
    setMyTripSelect(false);
    setDeleteSelect(false);
  };  
  const myRouteSelected = () => {
    setMyProfileSelect(false);
    setMyBusSelect(false);
    setMyRouteSelect(true)
    setMyTripSelect(false);
    setDeleteSelect(false);
  };
  const myTripSelected = () => {
    setMyProfileSelect(false);
    setMyBusSelect(false);
    setMyRouteSelect(false)
    setMyTripSelect(true);
    setDeleteSelect(false);
  };
  const deleteSelected = () => {
    setMyProfileSelect(false);
    setMyTripSelect(false);
    setDeleteSelect(true);
  };

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
        {deleteSelect && <DeleteAccount />}
      </div>
    </div>
  );
}

