import { useEffect, useState } from "react";
import { useNavigate,Outlet,useLocation } from "react-router-dom";
import { useAuthStatus } from "../../utils/hooks/useAuth.js";
import DeleteAccount from "../../pages/DeleteAccount.jsx";
import ViewBus from "./MyBuses/ViewBus.jsx"
import ViewRoutes from "./MyRoutes/ViewRoutes.jsx"
import ViewTrips from "./MyTrips/ViewTrips.jsx"
import Ownerprofile from "./Ownerprofile.jsx";
import SideBar from "../common/SideBar.jsx";
import "aos/dist/aos.css";
import ViewReviews from "./MyReviews/ViewReviews.jsx";
import ViewComplaints from "../common/view_complaints/ViewComplaints.jsx";

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

  const [myProfileSelect, setMyProfileSelect] = useState(true);
  const [myBusSelect, setMyBusSelect] = useState(false);
  const [myRouteSelect, setMyRouteSelect] = useState(false);
  const [myTripSelect, setMyTripSelect] = useState(false);
  const [myReviewsSelect, setMyReviewsSelect] = useState(false)
  const [deleteSelect, setDeleteSelect] = useState(false);
  const [complaintSelect,setComplaintSelect] = useState(false);

  const myProfileSelected = () => {
    setMyProfileSelect(true);
    setMyBusSelect(false);
    setMyRouteSelect(false)
    setMyTripSelect(false);
    setDeleteSelect(false);
    setMyReviewsSelect(false)
    setComplaintSelect(false);
    navigation("/BusHome/Ownerprofile")
  };
  const myBusSelected = () => {
    setMyProfileSelect(false);
    setMyBusSelect(true);
    setMyRouteSelect(false)
    setMyTripSelect(false);
    setDeleteSelect(false);
    setMyReviewsSelect(false)
    setComplaintSelect(false);
    navigation("/BusHome/ViewBus")
  };  
  const myRouteSelected = () => {
    setMyProfileSelect(false);
    setMyBusSelect(false);
    setMyRouteSelect(true)
    setMyTripSelect(false);
    setDeleteSelect(false);
    setMyReviewsSelect(false)
    setComplaintSelect(false);
    navigation("/BusHome/ViewRoutes")
  };
  const myTripSelected = () => {
    setMyProfileSelect(false);
    setMyBusSelect(false);
    setMyRouteSelect(false)
    setMyTripSelect(true);
    setDeleteSelect(false);
    setMyReviewsSelect(false)
    setComplaintSelect(false);
    navigation("/BusHome/view-trips")
  };
  const deleteSelected = () => {
    setMyProfileSelect(false);
    setMyBusSelect(false);
    setMyRouteSelect(false)
    setMyTripSelect(false);
    setDeleteSelect(true);
    setMyReviewsSelect(false)
    setComplaintSelect(false);
    navigation("/BusHome/delete-account")
  };

  const complaintSelected = () => {
    setMyProfileSelect(false);
    setMyBusSelect(false);
    setMyRouteSelect(false)
    setMyTripSelect(false);
    setDeleteSelect(false);
    setComplaintSelect(true);
    setMyReviewsSelect(false)
    navigation("/BusHome/view-complaints")
  };
  const myReviewsSelected = () => {
    setMyProfileSelect(false);
    setMyBusSelect(false);
    setMyRouteSelect(false)
    setMyTripSelect(false);
    setDeleteSelect(false);
    setMyReviewsSelect(true)
    setComplaintSelect(false);
    navigation("/BusHome/view-reviews")
  }

  const options = [
    // options list  for the sidebar component
    {
      name: " My Profile",
      state: myProfileSelect,
      onChange: myProfileSelected,
    },
    {
      name: "My buses",
      state: myBusSelect,
      onChange: myBusSelected,
    },

    {
      name: "My Routes",
      state: myRouteSelect,
      onChange: myRouteSelected,
    },
    {
      name: "My Trips",
      state: myTripSelect,
      onChange: myTripSelected,
    },
    {
      name: "My Reviews",
      state: myReviewsSelect,
      onChange: myReviewsSelected,
    },
    {
      name: "Delete Account",
      state: deleteSelect,
      onChange: deleteSelected,
    }, 
    

    {
      name: "View Complaints",
      state: complaintSelect,
      onChange: complaintSelected,
    },
  ];

  useEffect(() => {
    if (authStatus) {
      if (localStorage.getItem("user_role") !== "3") {
        // if user is not admin redirect to login
        navigate("/login");
      }
    } else {
      navigate("/login"); // if user not logged in redirect to login
    }
  }, [navigate,authStatus]);

  return (
    <div className="d-flex flex-column flex-md-row flex-lg-row">
      <div  className="fixed-sidebar">
        <SideBar heading="Bus Owner Profile" options={options} 
        />
      </div>
      <div className="main_content" style={{ width: "98vw"}}>
        <Outlet />
      </div>
    </div>
  );
}

