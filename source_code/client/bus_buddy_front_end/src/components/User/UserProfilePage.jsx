import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardText from "react-bootstrap/esm/CardText";
import { Image } from "react-bootstrap";

import { axiosApi } from "../../utils/axiosApi";
import UpdateImage from "../../assets/update.jpg";
import ChangePassword from "../../pages/ChangePassword";
import UpdateFormCard from "./UpdateFormCard";

export default function UserProfilePage(props) {
  const [currentUserData, setCurrentUserData] = useState([]);

  const [myProfileView, setmyProfileView] = useState(true);
  const [changePasswordView, setChangePasswordView] = useState(false);
  const [updateProfileView, setUpdateProfileView] = useState(false);

  const myProfileViewSelected = () => {
    setmyProfileView(true);
    setChangePasswordView(false);
    setUpdateProfileView(false);
  };

  const changePasswordViewSelected = () => {
    setmyProfileView(false);
    setChangePasswordView(true);
    setUpdateProfileView(false);
  };

  const updateProfileViewSelected = () => {
    setmyProfileView(false);
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
            currentUserData["first_name"] + " " + currentUserData["last_name"]
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
                className="d-grid gap-1 gap-md-2 gap-lg-3 gap-xl-3 p-4 p-3 mb-5 bg-body rounded"
                style={{
                  boxShadow: "0px 0px 22px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardText>
                  <div className="d-flex flex-column m-2">
                    Your name:
                    <h5>
                      {currentUserData["first_name"] +
                        " " +
                        currentUserData["last_name"]}
                    </h5>
                  </div>
                </CardText>
                <div className="d-flex">
                  <CardText style={{ color: "gray" }}>
                    &nbsp;&nbsp; Contact Details &nbsp;&nbsp;
                  </CardText>
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-3">
                      <CardText>
                        Phone number:
                        <h5>{currentUserData["phone"]}</h5>
                      </CardText>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-9">
                      <CardText>
                        Email:
                        <h5>{currentUserData["email"]}</h5>
                      </CardText>
                    </div>{" "}
                  </div>
                </div>
                <div className="d-flex justify-content-md-end">
                  <div className="m-1">
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
        <div className="m-4">
          <Button onClick={myProfileViewSelected}>Back</Button>
        </div>
      )}
      <div>
        <Image
          src={UpdateImage}
          className="d-none d-md-block"
          style={{ position: "absolute", bottom: 0, right: 0, width: "10rem" }}
        />
      </div>
    </>
  );
}
