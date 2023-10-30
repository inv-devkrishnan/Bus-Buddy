import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "/home/antony.jose/mock_bus_budddy/Bus-Buddy/source_code/client/bus_buddy_front_end/src/utils/hooks/useAuth.js";
import UserSideBar from "/home/antony.jose/mock_bus_budddy/Bus-Buddy/source_code/client/bus_buddy_front_end/src/utils/hooks/UserSideBar.js";
import DeleteAccount from "/home/antony.jose/mock_bus_budddy/Bus-Buddy/source_code/client/bus_buddy_front_end/src/pages/DeleteAccount.jsx";
import ViewBus from "/home/antony.jose/mock_bus_budddy/Bus-Buddy/source_code/client/bus_buddy_front_end/src/components/Bus_Ui/ViewBus.js"
import ViewRoutes from "/home/antony.jose/mock_bus_budddy/Bus-Buddy/source_code/client/bus_buddy_front_end/src/components/route_ui/ViewRoutes.js"
import Ownerprofile from "./Ownerprofile";

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

  // useEffect(() => {
  //   if (authStatus) {
  //     if (localStorage.getItem("user_role") !== "3") {
  //       // if user is not admin redirect to login
  //       navigate("/login");
  //     }
  //   } else {
  //     navigate("/login"); // if user not logged in redirect to login
  //   }
  // }, [navigate,authStatus]);

  return (
    <div style={{display:"flex",justifyContent:"space-between"}}>
      <div>
        <UserSideBar
          myProfileSelected={myProfileSelected}
          myProfileSelect={myProfileSelect}
          myBusSelected={myBusSelected}
          myBusSelect={myBusSelect}
          myRouteSelected={myRouteSelected}
          myRouteSelect={myRouteSelect}
          myTripSelected={myTripSelected}
          myTripSelect={myTripSelect}
          deleteSelected={deleteSelected}
          deleteSelect={deleteSelect}
        />
      </div>
      <div style={{ flex: 1 }}>
        {myProfileSelect && <Ownerprofile/>}
        {myBusSelect && <ViewBus/>}
        {myRouteSelect && <ViewRoutes/>}
        {myTripSelect && <h1>List User Page</h1>}
        {deleteSelect && <DeleteAccount />}
      </div>
    </div>
  );
}

