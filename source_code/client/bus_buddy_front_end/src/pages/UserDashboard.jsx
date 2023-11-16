import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStatus } from "../utils/hooks/useAuth";
import SideBar from "../components/common/SideBar";
import DeleteAccount from "../pages/DeleteAccount";
import UserProfilePage from "../components/User/UserProfilePage";
import UserBookingHistory from "../components/User/UserBookingHistory";

export default function UserDashboard() {
  const navigate = useNavigate();
  const authStatus = useAuthStatus();
  const [myProfileSelect, setMyProfileSelect] = useState(true);
  const [myTripSelect, setMyTripSelect] = useState(false);
  const [deleteSelect, setDeleteSelect] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (authStatus) {
      if (localStorage.getItem("user_role") !== "2") {
        // if user is not user redirect to login
        navigate("/login");
      }
    } else {
      navigate("/login"); // if user not logged in redirect to login
    }
  }, [navigate, authStatus]);


  const myProfileSelected = () => {
    setMyProfileSelect(true);
    setMyTripSelect(false);
    setDeleteSelect(false);
  };
  const myTripSelected = () => {
    setMyProfileSelect(false);
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
      name: "My Profile",
      state: myProfileSelect,
      onChange: myProfileSelected,
    },
    {
      name: "My Trips",
      state: myTripSelect,
      onChange: myTripSelected,
    },

    {
      name: "Delete Account",
      state: deleteSelect,
      onChange: deleteSelected,
    },
  ];

  return (
    <div className="d-flex">
      <div className="fixed-sidebar">
          <SideBar heading={userName} options={options} />
      </div>
      <div className="p-2 flex-fill bd-highlight">
          {myProfileSelect && <UserProfilePage setUserName={setUserName}/>}
          {myTripSelect && <UserBookingHistory />}
          {deleteSelect && <DeleteAccount />}
      </div>
    </div>
  );
}
