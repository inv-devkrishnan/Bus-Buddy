import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStatus } from "../utils/hooks/useAuth";
import UserSideBar from "../components/User/UserSideBar";
import DeleteAccount from "../pages/DeleteAccount";

export default function UserDashboard() {
  const navigate = useNavigate();

  const [myProfileSelect, setMyProfileSelect] = useState(false);
  const [myTripSelect, setMyTripSelect] = useState(false);
  const [deleteSelect, setDeleteSelect] = useState(false);

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
    if (useAuthStatus) {
      if (localStorage.getItem("user_role") !== "2") {
        // if user is not admin redirect to login
        navigate("/login");
      }
    } else {
      navigate("/login"); // if user not logged in redirect to login
    }
  }, [navigate]);

  return (
    <div className="d-flex justify-content-start">
      <div className="p-2 bd-highlight">
        <UserSideBar
          myProfileSelected={myProfileSelected}
          myProfileSelect={myProfileSelect}
          myTripSelected={myTripSelected}
          myTripSelect={myTripSelect}
          deleteSelected={deleteSelected}
          deleteSelect={deleteSelect}
        />
      </div>
      <div className="p-2 bd-highlight">
        {myProfileSelect && <h1>Profile Page</h1>}
        {myTripSelect && <h1>List User Page</h1>}
        {deleteSelect && <DeleteAccount />}
      </div>
    </div>
  );
}
