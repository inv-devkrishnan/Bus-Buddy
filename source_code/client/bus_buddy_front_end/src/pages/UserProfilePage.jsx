import React, { useState,useEffect } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardText from "react-bootstrap/esm/CardText";
import { Image } from "react-bootstrap";

import { axiosApi } from "../utils/axiosApi";
import UpdateImage from "../assets/update.jpg";
import ChanngePassword from "../pages/ChangePassword";
import UpdateFormCard from "../components/User/UpdateFormCard";

export default function UserProfilePage() {
  const [selectChangePassword, setSelectChangePassword] = useState(false);
  const [selectEdit, setSelectEdit] = useState(false);

  const [currentUserData, setCurrentUserData] = useState([]);
  useEffect(() => {
    axiosApi
      .get("user/update-profile")
      .then((res) => {
        setCurrentUserData(res.data);
      })
      .catch((err) => {
        alert("User does not exist!!");
      });
  }, []);

  return (
    <>
      <div
        className="d-flex align-items-start flex-column bd-highlight mb-3"
        style={{ height: "200px" }}
      >
        {selectChangePassword ? (
          <div className="mb-auto p-2 bd-highlight">
            <ChanngePassword />
            <div className="mt-3 ml-3">
              <Button onClick={() => setSelectChangePassword(false)}>
                Back
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-auto p-2 bd-highlight m-3">
              <h1>My Profile</h1>
            </div>
            <div className="mb-auto p-2 bd-highlight">
              {selectEdit ? (
                <div className="mb-auto p-2 bd-highlight">
                  <UpdateFormCard />
                  <div className="mt-5 ml-3">
                    <Button onClick={() => setSelectEdit(false)}>
                      Back
                    </Button>
                  </div>
                </div>
              ) : (
                <Card
                  className="d-grid gap-1 gap-md-2 gap-lg-3 gap-xl-3 p-4 shadow p-3 mb-5 bg-body rounded"
                  style={{
                    width: "250%",
                    boxShadow: "0px 0px 22px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardText>Your name:{" "+currentUserData["first_name"]+" "+currentUserData["last_name"]}</CardText>
                  <CardText style={{ color: "gray" }}>
                    _______________ &nbsp;&nbsp; Contact Details &nbsp;&nbsp;
                    _______________
                  </CardText>
                  <CardText>Phone number:{" "+currentUserData["phone"]}</CardText>
                  <CardText>Email:{" "+currentUserData["email"]}:</CardText>
                  <div className="d-flex justify-content-end">
                    <div className="m-1">
                      <Button onClick={() => setSelectChangePassword(true)}>
                        Change password
                      </Button>
                    </div>
                    <div className="m-1">
                      <Button onClick={() => setSelectEdit(true)}>Edit</Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
      <div style={{ position: "absolute", bottom: 0, right: 0 }}>
        <div className="mt-auto p-2 bd-highlight">
          <Image src={UpdateImage} style={{ width: "20rem" }} />
        </div>
      </div>
    </>
  );
}
