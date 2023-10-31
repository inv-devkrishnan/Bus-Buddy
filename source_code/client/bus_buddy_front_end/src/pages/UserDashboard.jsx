import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStatus } from "../utils/hooks/useAuth";
import UserSideBar from "../components/User/UserSideBar";
import DeleteAccount from "../pages/DeleteAccount";
import UserProfilePage from "./UserProfilePage";
import UserBookingHistory from "./UserBookingHistory";
import { UserContext } from "../components/User/UserContext";

export default function UserDashboard() {
  const navigate = useNavigate();
  const authStatus = useAuthStatus();
  const [myProfileSelect, setMyProfileSelect] = useState(true);
  const [myTripSelect, setMyTripSelect] = useState(false);
  const [deleteSelect, setDeleteSelect] = useState(false);
  const [userName, setUserName] = useState("");
  const contextValue = useMemo(
    () => ({ userName, setUserName }),
    [userName, setUserName]
  );

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

  useEffect(() => {
    if (authStatus) {
      if (localStorage.getItem("user_role") !== "2") {
        // if user is not admin redirect to login
        navigate("/login");
      }
    } else {
      navigate("/login"); // if user not logged in redirect to login
    }
  }, [navigate, authStatus]);

  return (
    <div className="d-flex">
      <div>
        <UserContext.Provider value={contextValue}>
          <UserSideBar
            myProfileSelected={myProfileSelected}
            myProfileSelect={myProfileSelect}
            myTripSelected={myTripSelected}
            myTripSelect={myTripSelect}
            deleteSelected={deleteSelected}
            deleteSelect={deleteSelect}
            userName={userName}
          />
        </UserContext.Provider>
      </div>
      <div className="p-2 flex-fill bd-highlight">
        <UserContext.Provider value={contextValue}>
          {myProfileSelect && <UserProfilePage />}
          {myTripSelect && <UserBookingHistory />}
          {deleteSelect && <DeleteAccount />}
        </UserContext.Provider>
      </div>
    </div>
  );
}
