import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardText from "react-bootstrap/esm/CardText";
import { Image } from "react-bootstrap";

import { axiosApi } from "../../utils/axiosApi";
import UpdateImage from "../../assets/update.png";
import ProfileImage from "../../assets/profile.png";
import ChangePassword from "../../pages/ChangePassword";
import UpdateFormCard from "./UpdateFormCard";

export default function UserProfilePage(props) {
  const [currentUserData, setCurrentUserData] = useState([]);

  const [myProfileView, setMyProfileView] = useState(true);
  const [changePasswordView, setChangePasswordView] = useState(false);
  const [updateProfileView, setUpdateProfileView] = useState(false);

  const myProfileViewSelected = () => {
    setMyProfileView(true);
    setChangePasswordView(false);
    setUpdateProfileView(false);
  };

  const changePasswordViewSelected = () => {
    setMyProfileView(false);
    setChangePasswordView(true);
    setUpdateProfileView(false);
  };

  const updateProfileViewSelected = () => {
    setMyProfileView(false);
    setChangePasswordView(false);
    setUpdateProfileView(true);
  };

  const [googleUser, setGoogleUser] = useState(false);

  useEffect(() => {
    axiosApi
      .get("user/update-profile")
      .then((res) => {
        setCurrentUserData(res.data);
        if (localStorage.getItem("account_provider") === "1") {
          setGoogleUser(true);
        }
        props.setUserName(
          `${
            currentUserData["first_name"] +
            " " +
            (currentUserData["last_name"] ? currentUserData["last_name"] : "")
          }`
        );
      })
      .catch((err) => {
        console.log(err.reponse);
      });
  }, [props]);

  return (
    <>
      <div className="p-2">
        <div className="mb-auto p-2 bd-highlight m-3">
          <h1>My Profile</h1>
        </div>
        <div className="p-2">
          {myProfileView && (
            <div>
              <Card
                className="d-flex flex-column"
                style={{
                  width: "100%",
                  boxShadow: "0px 0px 22px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="d-flex flex-column m-2 p-1">
                  <CardText>Your name:</CardText>
                  <CardText as="h5">
                    {currentUserData["first_name"] +
                      " " +
                      (currentUserData["last_name"]
                        ? currentUserData["last_name"]
                        : "")}
                  </CardText>
                </div>
                <div className="d-flex">
                  <CardText style={{ color: "gray" }}>
                    &nbsp;&nbsp; Contact Details &nbsp;&nbsp;
                  </CardText>
                </div>
                <div className="container">
                  <div className="row">
                    {currentUserData["phone"] && (
                      <div className="col-sm-12 col-md-12 col-lg-3">
                        <CardText>Phone number:</CardText>
                        <CardText as="h5">{currentUserData["phone"]}</CardText>
                      </div>
                    )}
                    <div className="col-sm-12 col-md-12 col-lg-9">
                      <CardText>Email: </CardText>
                      <CardText as="h5">{currentUserData["email"]}</CardText>
                    </div>{" "}
                  </div>
                </div>
                <div className="d-flex justify-content-end flex-column flex-md-row flex-lg-row m-3">
                  <div className="d-flex m-1">
                    {!googleUser && ( // for rendering change password button only for normal sign in
                      <Button onClick={changePasswordViewSelected}>
                        Change password
                      </Button>
                    )}
                  </div>
                  <div className="m-1">
                    <Button onClick={updateProfileViewSelected}>Edit</Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
          {changePasswordView && <ChangePassword />}
          {updateProfileView && <UpdateFormCard />}
        </div>{" "}
      </div>
      {myProfileView ? null : (
        <div className="m-2">
          <Button onClick={myProfileViewSelected}>Back</Button>
        </div>
      )}
      <div>
        <Image
          src={
            changePasswordView || updateProfileView ? UpdateImage : ProfileImage
          }
          className="d-none d-md-block d-sm-block"
          style={{ position: "absolute", bottom: 0, right: 0, width: "15%" }}
        />
      </div>
    </>
  );
}
