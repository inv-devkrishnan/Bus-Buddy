import { useEffect, useState } from "react";
import SideBar from "../components/common/SideBar";
import { useAuthStatus } from "../utils/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ProfileView from "../components/admin/ProfileView";
import ListUsers from "../components/admin/ListUsers";

function AdminDashboard() {
  // three state variable for three options
  const [profileSelect, setProfileSelect] = useState(true); // if true shows profile component
  const [listUserSelect, setListUserSelect] = useState(false); // if true shows listuser component
  const [busSelect, setBusSelect] = useState(false); // if true shows bus owner approval component
  const navigate = useNavigate();
  const authStatus = useAuthStatus();

  const profileSelected = () => {
    // when executed it displays the profile
    setProfileSelect(true);
    setListUserSelect(false);
    setBusSelect(false);
  };
  const listUserSelected = () => {
    // when executed it displays the list user
    setProfileSelect(false);
    setListUserSelect(true);
    setBusSelect(false);
  };
  const busSelected = () => {
    // when executed it displays the bus owner approval
    setProfileSelect(false);
    setListUserSelect(false);
    setBusSelect(true);
  };

  const options = [
    // options list  for the sidebar component
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
    if (authStatus) {
      if (localStorage.getItem("user_role") !== "1") {
        // if user is not admin redirect to login
        navigate("/login");
      }
    } else {
      navigate("/login"); // if user not logged in redirect to login
    }
  }, [navigate, authStatus]);
  return (
    <div className="d-flex flex-column flex-md-row flex-lg-row">
      <div className="fixed-sidebar">
      <SideBar heading="Admin Profile" options={options} />
      </div>
      <div className="main_content">
        {profileSelect && <ProfileView />}
        {listUserSelect && <ListUsers busApproval={false}/>}
        {busSelect && <ListUsers busApproval={true}/>}
      </div>
    </div>
  );
}
export default AdminDashboard;
