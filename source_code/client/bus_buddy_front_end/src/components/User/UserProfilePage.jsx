import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardText from "react-bootstrap/esm/CardText";
import { Placeholder } from "react-bootstrap";

import { axiosApi } from "../../utils/axiosApi";
import { useNavigate } from "react-router-dom";

export default function UserProfilePage() {
  const [currentUserData, setCurrentUserData] = useState([]);
  const [myProfileView, setMyProfileView] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(true); // to show/hide placeholder
  const navigate = useNavigate();

  const changePasswordViewSelected = () => {
    setMyProfileView(false);
    navigate("/user-dashboard/profile/change-password");
  };

  const updateProfileViewSelected = () => {
    setMyProfileView(false);
    navigate("/user-dashboard/profile/edit");
  };

  const [googleUser, setGoogleUser] = useState(false);

  const fetchUserData = async () => {
    try {
      const res = await axiosApi.get("user/update-profile");
      setCurrentUserData(res.data);

      if (localStorage.getItem("account_provider") === "1") {
        setGoogleUser(true);
      }
      setIsProfileLoading(false);
    } catch (err) {
      console.error(err.response);
      setIsProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="p-2">
      <div className="mb-auto p-2 bd-highlight m-3">
        <h1>My Profile</h1>
      </div>
      <div className="p-2">
        {myProfileView && (
          <div>
            {isProfileLoading ? (
              <Card
                className="d-flex flex-column"
                style={{
                  width: "100%",
                  boxShadow: "0px 0px 22px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="d-flex flex-column m-2 p-1">
                  <Placeholder as={CardText} animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>{" "}
                  <Placeholder as={CardText} animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>
                </div>

                <div className="d-flex">
                  <CardText style={{ color: "gray" }}>
                    &nbsp;&nbsp; Contact Details &nbsp;&nbsp;
                  </CardText>
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-3">
                      <Placeholder as={CardText} animation="glow">
                        <Placeholder xs={4} />
                      </Placeholder>{" "}
                      <Placeholder as={CardText} animation="glow">
                        <Placeholder xs={4} />
                      </Placeholder>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-9">
                      <Placeholder as={CardText} animation="glow">
                        <Placeholder xs={8} />
                      </Placeholder>{" "}
                      <Placeholder as={CardText} animation="glow">
                        <Placeholder xs={8} />
                      </Placeholder>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end flex-column flex-md-row flex-lg-row m-3">
                  {!googleUser && ( // for rendering change password button only for normal sign in
                    <Placeholder.Button
                      variant="primary"
                      xs={3}
                      className="m-1"
                    />
                  )}
                  <Placeholder.Button
                    variant="primary"
                    xs={2}
                    className="m-1"
                  />
                </div>
              </Card>
            ) : (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
