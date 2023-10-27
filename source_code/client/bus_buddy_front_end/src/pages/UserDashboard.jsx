import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStatus } from "../utils/hooks/useAuth";
import UserSideBar from "../components/User/UserSideBar";
import DeleteAccount from "../pages/DeleteAccount"

export default function UserDashboard() {
  const navigate = useNavigate();

  const [profileSelect, setProfileSelect] = useState(false);
  const [listUserSelect, setListUserSelect] = useState(false);
  const [busSelect, setBusSelect] = useState(false);
  const [deleteSelect, setDeleteSelect] = useState(false)

  const profileSelected = () => {
    setProfileSelect(true);
    setListUserSelect(false);
    setBusSelect(false);
  };
  const listUserSelected = () => {
    setProfileSelect(false);
    setListUserSelect(true);
    setBusSelect(false);
  };
  const busSelected = () => {
    setProfileSelect(false);
    setListUserSelect(false);
    setBusSelect(true);
  };

  const deleteSelected = () => {
    setProfileSelect(false);
    setListUserSelect(false);
    setBusSelect(false);
    setDeleteSelect(true)
  };

  useEffect(() => {
    if (useAuthStatus) { 
      if (localStorage.getItem("user_role") !== "2") // if user is not admin redirect to login
      {
        navigate("/login");
      } 
    } else {
      navigate("/login"); // if user not logged in redirect to login
    }
  }, [navigate]);

  return (
    <div>
      <UserSideBar  profileSelected={profileSelected}
        profileSelect={profileSelect}
        listUserSelected={listUserSelected}
        listUserSelect={listUserSelect}
        busSelected={busSelected}
        busSelect={busSelect}
        deleteSelected={deleteSelected}
        deleteSelect={deleteSelect}
        />
       

        <div>
        {profileSelect && <h1>Profile Page</h1>}
        {listUserSelect && <h1>List User Page</h1>}
        {busSelect && <h1>Bus owner Approval Page</h1>}
        {deleteSelect && <DeleteAccount/>}
        </div>
    </div>
  );
}
