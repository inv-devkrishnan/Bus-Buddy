import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosApi } from "../../utils/axiosApi";
import Card from "react-bootstrap/Card";

export default function Ownerprofile() {
  const [currentUserData, setCurrentUserData] = useState({});

  useEffect(() => {
    axiosApi
      .get("bus-owner/update-profile")
      .then((res) => {
        setCurrentUserData(res.data);
      })
      .catch((err) => {
        console.log(err.response);
        alert("User does not exist!!");
      });
  }, []);


  return (
    <div style={{display:"flex",justifyContent:"center" }}  >
      <div style={{ marginBottom: "2%",marginTop:"11%"}}>
        <Card style={{ width: "55rem", height: "20rem",boxShadow: "5px 5px 30px 0 rgba(29, 108, 177, 0.5)" }}>
          <Card.Body>
            <Card.Title style={{ display: "flex", justifyContent: "center", }}>
              {currentUserData['first_name']}
              
              {currentUserData['last_name']}
            </Card.Title>
            <p>Name: {currentUserData['first_name']}</p>
            <p>Last name: {currentUserData['last_name']}</p>
            <p>Phone Number: {currentUserData['phone']}</p>
            <p>Email ID: {currentUserData['email']}</p>
            <p>Company Name: {currentUserData['company_name']}</p>
            <div style={{display:"flex",justifyContent:"flex-end"}}>
            <Link to="/Update-Profile">
              <button className="btn btn-primary m-3">Update Profile</button>
            </Link>
            <Link to="/change-password">
              <button className="btn btn-primary m-3">Change Password</button>
            </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
