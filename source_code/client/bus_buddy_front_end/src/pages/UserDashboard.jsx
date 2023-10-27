import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStatus } from "../utils/hooks/useAuth";
import UserSideBar from "../components/User/UserSideBar";

export default function UserDashboard() {
  const navigate = useNavigate();

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
      <UserSideBar />
    </div>
  );
}
