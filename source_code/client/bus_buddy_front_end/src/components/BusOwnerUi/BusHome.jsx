import { useEffect, useReducer, useCallback } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStatus } from "../../utils/hooks/useAuth.js";
import SideBar from "../common/SideBar.jsx";
import "aos/dist/aos.css";

export default function UserDashboard() {
  const authStatus = useAuthStatus();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = (url) => {
    if (location.pathname === url) {
      navigate(url, { replace: true });
    } else {
      navigate(url);
    }
  };

  const optionSelection = (state, action) => {
    switch (action.type) {
      case "profile":
        return {
          myProfileSelect: true,
          myBusSelect: false,
          myRouteSelect: false,
          myTripSelect: false,
          deleteSelect: false,
          myReviewsSelect: false,
          complaintSelect: false,
        };
      case "myBus":
        return {
          myProfileSelect: false,
          myBusSelect: true,
          myRouteSelect: false,
          myTripSelect: false,
          deleteSelect: false,
          myReviewsSelect: false,
          complaintSelect: false,
        };
      case "myRoute":
        return {
          myProfileSelect: false,
          myBusSelect: false,
          myRouteSelect: true,
          myTripSelect: false,
          deleteSelect: false,
          myReviewsSelect: false,
          complaintSelect: false,
        };
      case "myTrip":
        return {
          myProfileSelect: false,
          myBusSelect: false,
          myRouteSelect: false,
          myTripSelect: true,
          deleteSelect: false,
          myReviewsSelect: false,
          complaintSelect: false,
        };
      case "delete":
        return {
          myProfileSelect: false,
          myBusSelect: false,
          myRouteSelect: false,
          myTripSelect: false,
          deleteSelect: true,
          myReviewsSelect: false,
          complaintSelect: false,
        };
      case "myReviews":
        return {
          myProfileSelect: false,
          myBusSelect: false,
          myRouteSelect: false,
          myTripSelect: false,
          deleteSelect: false,
          myReviewsSelect: true,
          complaintSelect: false,
        };
      case "complaint":
        return {
          myProfileSelect: false,
          myBusSelect: false,
          myRouteSelect: false,
          myTripSelect: false,
          deleteSelect: false,
          myReviewsSelect: false,
          complaintSelect: true,
        };
      default:
        return state;
    }
  };
  const initialState = {
    profile: false,
    myBus: false,
    myRoute: false,
    myTrip: false,
    delete: false,
    myReviews: false,
    complaint: false,
  };
  const [state, dispatch] = useReducer(optionSelection, initialState);

  const profileSelected = () => {
    dispatch({ type: "profile" });
    navigation("/BusHome/Ownerprofile");
  };

  const myBusSelected = () => {
    dispatch({ type: "myBus" });
    navigation("/BusHome/ViewBus");
  };

  const myRouteSelected = () => {
    dispatch({ type: "myRoute" });
    navigation("/BusHome/ViewRoutes");
  };

  const myTripSelected = () => {
    dispatch({ type: "myTrip" });
    navigation("/BusHome/view-trips");
  };

  const deleteSelected = () => {
    dispatch({ type: "delete" });
    navigation("/BusHome/delete-account");
  };

  const complaintSelected = () => {
    dispatch({ type: "complaint" });
    navigation("/BusHome/view-complaints");
  };

  const myReviewsSelected = () => {
    dispatch({ type: "myReviews" });
    navigation("/BusHome/view-reviews");
  };

  const options = [
    // options list  for the sidebar component
    {
      name: " My Profile",
      state: state.myProfileSelect,
      onChange: profileSelected,
    },
    {
      name: "My Buses",
      state: state.myBusSelect,
      onChange: myBusSelected,
    },

    {
      name: "My Routes",
      state: state.myRouteSelect,
      onChange: myRouteSelected,
    },
    {
      name: "My Trips",
      state: state.myTripSelect,
      onChange: myTripSelected,
    },
    {
      name: "My Reviews",
      state: state.myReviewsSelect,
      onChange: myReviewsSelected,
    },
    {
      name: "View Complaints",
      state: state.complaintSelect,
      onChange: complaintSelected,
    },
    {
      name: "Delete Account",
      state: state.deleteSelect,
      onChange: deleteSelected,
    },

  ];

  const highlightSelected = useCallback(() => {
    switch (location.pathname) {
      case "/BusHome/Ownerprofile":
        dispatch({ type: "profile" });
        break;
      case "/BusHome/ViewBus":
        dispatch({ type: "myBus" });
        break;
      case "/BusHome/ViewRoutes":
        dispatch({ type: "myRoute" });
        break;
      case "/BusHome/view-trips":
        dispatch({ type: "myTrip" });
        break;
      case "/BusHome/delete-account":
        dispatch({ type: "delete" });
        break;
      case "/BusHome/view-complaints":
        dispatch({ type: "complaint" });
        break;
      case "/BusHome/view-reviews":
        dispatch({ type: "myReviews" });
        break;
      default:
        console.log("invalid path");
    }
  }, [location]);

  useEffect(() => {
    if (authStatus) {
      if (localStorage.getItem("user_role") !== "3") {
        // if user is not admin redirect to login
        navigate("/login");
      }
    } else {
      navigate("/login"); // if user not logged in redirect to login
    }
    highlightSelected();
  }, [navigate, authStatus, highlightSelected]);

  return (
    <div className="d-flex flex-column flex-md-row flex-lg-row">
      <div className="fixed-sidebar">
        <SideBar heading="Bus Owner Profile" options={options} />
      </div>
      <div className="main_content" style={{ width: "98vw" }}>
        <Outlet />
      </div>
    </div>
  );
}
