import { useEffect, useState } from "react";
import AdmindSideBar from "../components/admin/AdminSideBar";
import { useAuthStatus } from "../utils/hooks/useAuth";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [profileSelect, setProfileSelect] = useState(false);
  const [listUserSelect, setListUserSelect] = useState(false);
  const [busSelect, setBusSelect] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (useAuthStatus) { 
      if (localStorage.getItem("user_role") !== "1") // if user is not admin redirect to login
      {
        navigate("/login");
      } 
    } else {
      navigate("/login"); // if user not logged in redirect to login
    }
  }, [navigate]);
  return (
    <div className="d-flex">
      <AdmindSideBar
        profileSelected={profileSelected}
        profileSelect={profileSelect}
        listUserSelected={listUserSelected}
        listUserSelect={listUserSelect}
        busSelected={busSelected}
        busSelect={busSelect}
      />
      <div>
        {profileSelect && <h1>Profile Page</h1>}
        {listUserSelect && <h1>List User Page</h1>}
        {busSelect && <h1>Bus owner Approval Page</h1>}
      </div>
    </div>
  );
}
export default AdminDashboard;
