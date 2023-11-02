import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "../../utils/hooks/useAuth";
import DeleteAccount from "../../pages/DeleteAccount";
import ViewBus from "../Bus_Ui/ViewBus"
import ViewRoutes from "../route_ui/ViewRoutes"
import UserSideBar from "../../utils/hooks/UserSideBar"
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

