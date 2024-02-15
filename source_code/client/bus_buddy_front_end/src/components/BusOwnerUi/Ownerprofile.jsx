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
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ marginBottom: "2%", marginTop: "11%",marginLeft:"-15%" }}>
        <Card
          style={{
            width: "150%",
            height: "100%",
            boxShadow: "5px 5px 30px 0 rgba(29, 108, 177, 0.5)",
          }}
        >
          <Card.Body>
            <Card.Title
              style={{
                display: "flex",
                justifyContent: "center",
                maxWidth: "100%",
                wordWrap: "break-word",
              }}
            >
              {currentUserData["first_name"]} {currentUserData["last_name"]}
            </Card.Title>
            <p style={{ maxWidth: "100%", wordWrap: "break-word" }}>
              Name: {currentUserData["first_name"]}
            </p>
            <p style={{ maxWidth: "100%", wordWrap: "break-word" }}>
              Last name: {currentUserData["last_name"]}
            </p>
            <p>Phone Number: {currentUserData["phone"]}</p>
            <p>Email ID: {currentUserData["email"]}</p>
            <p style={{ maxWidth: "100%", wordWrap: "break-word" }}>
              Company Name: {currentUserData["company_name"]}
            </p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Link to="/BusHome/update-owner">
                <button
                  className="btn btn-primary m-3"
                  style={{ width: "80%", height: "58%" }} // Set width and height here
                >
                  Update Profile
                </button>
              </Link>
              <Link to="/BusHome/change-password">
                <button
                  className="btn btn-primary m-3"
                  style={{ width: "80%", height: "58%" }} // Set width and height here
                >
                  Change Password
                </button>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
