import { useCallback, useEffect, useReducer } from "react";
import SideBar from "../components/common/SideBar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

function AdminDashboard() {
  // three state variable for three option
  const navigate = useNavigate();
  const location = useLocation();

  const optionSelection = (state, action) => {
    switch (action.type) {
      case "profile":
        return {
          profile: true,
          listUser: false,
          listOwner: false,
          listComplaint: false,
          listCoupon: false,
        };
      case "listUser":
        return {
          profile: false,
          listUser: true,
          listOwner: false,
          listComplaint: false,
          listCoupon: false,
        };
      case "listOwner":
        return {
          profile: false,
          listUser: false,
          listOwner: true,
          listComplaint: false,
          listCoupon: false,
        };
      case "listComplaint":
        return {
          profile: false,
          listUser: false,
          listOwner: false,
          listComplaint: true,
          listCoupon: false,
        };
      case "listCoupon":
        return {
          profile: false,
          listUser: false,
          listOwner: false,
          listComplaint: false,
          listCoupon: true,
        };
      default:
        return state;
    }
  };
  const initialState = {
    profile: false,
    listUser: false,
    listOwner: false,
    listComplaint: false,
    listCoupon: false,
  };
  const [state, dispatch] = useReducer(optionSelection, initialState);
  const navigation = (url) => {
    if (location.pathname === url) {
      navigate(url, { replace: true });
    } else {
      navigate(url);
    }
  };
  const profileSelected = () => {
    // when executed it displays the profile
    dispatch({ type: "profile" });
    navigation("/admin-dashboard/view-profile");
  };
  const listUserSelected = () => {
    // when executed it displays the list user
    dispatch({ type: "listUser" });
    navigation("/admin-dashboard/list-users");
  };
  const busSelected = () => {
    // when executed it displays the bus owner approval
    dispatch({ type: "listOwner" });
    navigation("/admin-dashboard/list-busowners");
  };
  const complaintSelected = () => {
    dispatch({ type: "listComplaint" });
    navigation("/admin-dashboard/view-complaints");
  };

  const couponSelected = () => {
    dispatch({ type: "listCoupon" });
    navigation("/admin-dashboard/show-coupon");
  };

  const options = [
    // options list  for the sidebar component
    {
      name: "Profile",
      state: state.profile,
      onChange: profileSelected,
    },
    {
      name: "List User",
      state: state.listUser,
      onChange: listUserSelected,
    },

    {
      name: "Bus Owner Approval",
      state: state.listOwner,
      onChange: busSelected,
    },

    {
      name: "View Complaints",
      state: state.listComplaint,
      onChange: complaintSelected,
    },
    {
      name: "Coupons",
      state: state.listCoupon,
      onChange: couponSelected,
    },
  ];

  const highlightSelected = useCallback(() => {
    switch (location.pathname) {
      case "/admin-dashboard/view-profile":
        dispatch({ type: "profile" });
        break;
      case "/admin-dashboard/view-profile/update":
        dispatch({ type: "profile" });
        break;
      case "/admin-dashboard/view-profile/change-password":
        dispatch({ type: "profile" });
        break;
      case "/admin-dashboard/show-coupon":
        dispatch({ type: "listCoupon" });
        break;
      case "/admin-dashboard/create-coupon":
        dispatch({ type: "listCoupon" });
        break;
      case "/admin-dashboard/view-complaints":
        dispatch({ type: "listComplaint" });
        break;
      case "/admin-dashboard/list-busowners":
        dispatch({ type: "listOwner" });
        break;
      case "/admin-dashboard/list-users":
        dispatch({ type: "listUser" });
        break;
      default:
        console.log("invalid path");
    }
  }, [location]);

  useEffect(() => {
    if (
      localStorage.getItem("user_role") !== "1" ||
      localStorage.getItem("token_expire_time") < Date.now()
    ) {
      // if user is not admin redirect to login
      navigate("/login");
    }
    highlightSelected();
  }, [navigate, highlightSelected]);
  return (
    <div className="d-flex flex-column flex-md-row flex-lg-row">
      <div className="fixed-sidebar">
        <SideBar heading="Admin Profile" options={options} />
      </div>
      <div className="main_content" style={{ width: "100vw" }}>
        <Outlet />
      </div>
    </div>
  );
}
export default AdminDashboard;
