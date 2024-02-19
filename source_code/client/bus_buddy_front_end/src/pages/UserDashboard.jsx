import { useEffect, useState, useCallback } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStatus } from "../utils/hooks/useAuth";
import SideBar from "../components/common/SideBar";

export default function UserDashboardReal() {
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useAuthStatus();
  const [myProfileSelect, setMyProfileSelect] = useState(true);
  const [myTripSelect, setMyTripSelect] = useState(false);
  const [deleteSelect, setDeleteSelect] = useState(false);
  const [complaintSelect, setComplaintSelect] = useState(false);
  const [reviewHistorySelect, setReviewHistorySelect] = useState(false);

  const navigation = useCallback(
    (url) => {
      if (location.pathname === url) {
        navigate(url, { replace: true });
      } else {
        navigate(url);
      }
    },
    [location.pathname, navigate]
  );

  const myProfileSelected = useCallback(() => {
    setMyProfileSelect(true);
    setMyTripSelect(false);
    setDeleteSelect(false);
    setComplaintSelect(false);
    setReviewHistorySelect(false);
    navigation("/user-dashboard/profile");
  }, [navigation]);

  const myTripSelected = useCallback(() => {
    setMyProfileSelect(false);
    setMyTripSelect(true);
    setDeleteSelect(false);
    setComplaintSelect(false);
    setReviewHistorySelect(false);
    navigation("/user-dashboard/my-trips");
  }, [navigation]);

  const deleteSelected = useCallback(() => {
    setMyProfileSelect(false);
    setMyTripSelect(false);
    setDeleteSelect(true);
    setComplaintSelect(false);
    setReviewHistorySelect(false);
    navigation("/user-dashboard/delete");
  }, [navigation]);

  const complaintSelected = useCallback(() => {
    setMyProfileSelect(false);
    setMyTripSelect(false);
    setDeleteSelect(false);
    setComplaintSelect(true);
    setReviewHistorySelect(false);
    navigation("/user-dashboard/complaint");
  }, [navigation]);

  const reviewHistorySelected = useCallback(() => {
    setMyProfileSelect(false);
    setMyTripSelect(false);
    setDeleteSelect(false);
    setComplaintSelect(false);
    setReviewHistorySelect(true);
    navigation("/user-dashboard/review");
  }, [navigation]);

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
      name: "My Reviews",
      state: reviewHistorySelect,
      onChange: reviewHistorySelected,
    },
    {
      name: "Register Complaint",
      state: complaintSelect,
      onChange: complaintSelected,
    },
    {
      name: "Delete Account",
      state: deleteSelect,
      onChange: deleteSelected,
    },
  ];

  const highlightChoice = useCallback(() => {
    switch (location.pathname) {
      case "/user-dashboard/profile":
        myProfileSelected();
        break;
      case "/user-dashboard/profile/edit":
        myProfileSelected();
        break;
      case "/user-dashboard/profile/change-password":
        myProfileSelected();
        break;
      case "/user-dashboard/my-trips":
        myTripSelected();
        break;
      case "/user-dashboard/delete":
        deleteSelected();
        break;
      case "/user-dashboard/complaint":
        complaintSelected();
        break;
      case "/user-dashboard/review":
        reviewHistorySelected();
        break;

      default:
        console.log("invalid path");
    }
  }, [
    complaintSelected,
    deleteSelected,
    location.pathname,
    myProfileSelected,
    myTripSelected,
    reviewHistorySelected,
  ]);

  useEffect(() => {
    if (authStatus) {
      if (localStorage.getItem("user_role") !== "2") {
        // if user is not user redirect to login
        navigate("/login");
      }
    } else {
      navigate("/login"); // if user not logged in redirect to login
    }
    highlightChoice();
  }, [navigate, authStatus, highlightChoice]);

  return (
    <div className="d-flex flex-column flex-md-row flex-lg-row">
      <div className="fixed-sidebar">
        <SideBar heading={"Profile"} options={options} />
      </div>
      <div className="flex-fill bd-highlight main_content">
        <Outlet />
      </div>
    </div>
  );
}
