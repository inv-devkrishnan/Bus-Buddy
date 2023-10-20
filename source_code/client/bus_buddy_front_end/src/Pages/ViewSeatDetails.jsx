import {React,useState} from "react";
import { useLocation } from "react-router-dom";
import UserLayout from "../Components/User/UserLayout";
import SeatDetailCard from "../Components/User/SeatDetailCard";
export default function ViewSeatDetails() {
  const location = useLocation();
  const isClicked = location.state; //stores the value as true which is passed from sleeper

  return (
    <div className="container">
      <div className="component">
        <UserLayout />
      </div>
      <div className="component">
        {isClicked && <SeatDetailCard />}
        {/* to render the form component outside the user layout 
      but the isClicked value is determined by the user sleeper component */}
      </div>
    </div>
  );
}
