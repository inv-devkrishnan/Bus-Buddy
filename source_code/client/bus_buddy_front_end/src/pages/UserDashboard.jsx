import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStatus } from "../utils/hooks/useAuth";
import SideBar from "../components/common/SideBar";
import DeleteAccount from "../pages/DeleteAccount";
import UserProfilePage from "../components/User/UserProfilePage";
import UserBookingHistory from "../components/User/UserBookingHistory";
import UserComplaint from "../components/User/UserComplaint";
import ReviewHistory from "../components/User/ReviewHistory";

export default function UserDashboardReal() {
  const navigate = useNavigate();
  const authStatus = useAuthStatus();
  const [myProfileSelect, setMyProfileSelect] = useState(true);
  const [myTripSelect, setMyTripSelect] = useState(false);
  const [deleteSelect, setDeleteSelect] = useState(false);
  const [complaintSelect, setComplaintSelect] = useState(false);
  const [reviewHistorySelect, setReviewHistorySelect] = useState(false);

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
    setComplaintSelect(false);
    setReviewHistorySelect(false);
  };
  const myTripSelected = () => {
    setMyProfileSelect(false);
    setMyTripSelect(true);
    setDeleteSelect(false);
    setComplaintSelect(false);
    setReviewHistorySelect(false);
  };
  const deleteSelected = () => {
    setMyProfileSelect(false);
    setMyTripSelect(false);
    setDeleteSelect(true);
    setComplaintSelect(false);
    setReviewHistorySelect(false);
  };
  const complaintSelected = () => {
    setMyProfileSelect(false);
    setMyTripSelect(false);
    setDeleteSelect(false);
    setComplaintSelect(true);
    setReviewHistorySelect(false);
  };
  const reviewHistorySelected = () => {
    setMyProfileSelect(false);
    setMyTripSelect(false);
    setDeleteSelect(false);
    setComplaintSelect(false);
    setReviewHistorySelect(true);
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

  return (
    <div className="d-flex flex-column flex-md-row flex-lg-row">
      <div className="fixed-sidebar">
        <SideBar heading={"Profile"} options={options} />
      </div>
      <div className="flex-fill bd-highlight main_content">
        {myProfileSelect && <UserProfilePage />}
        {myTripSelect && <UserBookingHistory />}
        {deleteSelect && <DeleteAccount />}
        {complaintSelect && <UserComplaint />}
        {reviewHistorySelect && <ReviewHistory />}
      </div>
    </div>
  );
}
