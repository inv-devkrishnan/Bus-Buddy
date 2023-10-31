import React, { useState, useEffect, useContext } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardText from "react-bootstrap/esm/CardText";
import { Image } from "react-bootstrap";

import { axiosApi } from "../utils/axiosApi";
import UpdateImage from "../assets/update.jpg";
import ChangePassword from "../pages/ChangePassword";
import UpdateFormCard from "../components/User/UpdateFormCard";
import { UserContext } from "../components/User/UserContext";

export default function UserProfilePage() {
  const {setUserName} = useContext(UserContext)
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
        setUserName(currentUserData["first_name"])
        if (localStorage.getItem("account_provider") === "1") {
          setGoogleUser(true);
        }
      })
      .catch((err) => {
        console.log(err.reponse);
      });
  }, []);

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
                  Your name:
                  {" " +
                    currentUserData["first_name"] +
                    " " +
                    currentUserData["last_name"]}
                </CardText>
                <CardText style={{ color: "gray" }}>
                  _______________ &nbsp;&nbsp; Contact Details &nbsp;&nbsp;
                  _______________
                </CardText>
                <CardText>
                  Phone number:{" " + currentUserData["phone"]}
                </CardText>
                <CardText>Email:{" " + currentUserData["email"]}:</CardText>
                <div className="d-flex justify-content-end">
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
      <div style={{ position: "absolute", bottom: 0, right: 0 }}>
        <Image src={UpdateImage} style={{ width: "20rem" }} />
      </div>
    </>
  );
}
