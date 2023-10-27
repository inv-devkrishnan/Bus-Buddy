import { useEffect, useState } from "react";
import SideBar from "../components/common/SideBar";
import { useAuthStatus } from "../utils/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ProfileView from "../components/admin/ProfileView";

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

  const options = [
    {
      name: "Profile",
      state: profileSelect,
      onChange: profileSelected,
    },
    {
      name: "List User",
      state: listUserSelect,
      onChange: listUserSelected,
    },

    {
      name: "Bus Owner Approval",
      state: busSelect,
      onChange: busSelected,
    },
  ];

  useEffect(() => {
    if (useAuthStatus) {
      if (localStorage.getItem("user_role") !== "1") {
        // if user is not admin redirect to login
        navigate("/login");
      }
    } else {
      navigate("/login"); // if user not logged in redirect to login
    }
  }, [navigate]);
  return (
    <div className="d-flex">
      <SideBar heading="Admin Profile" options={options} />
      <div>
        {profileSelect && <ProfileView />}
        {listUserSelect && <h1>List User Page</h1>}
        {busSelect && <h1>Bus owner Approval Page</h1>}
      </div>
    </div>
  );
}
export default AdminDashboard;
