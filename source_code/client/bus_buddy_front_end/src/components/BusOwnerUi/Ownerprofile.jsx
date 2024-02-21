import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosApi } from "../../utils/axiosApi";
import Card from "react-bootstrap/Card";
import CardText from "react-bootstrap/esm/CardText";
import { Placeholder } from "react-bootstrap";



export default function Ownerprofile() {
  const [currentUserData, setCurrentUserData] = useState({});
  const [isProfileLoading, setIsProfileLoading] = useState(true); // to show/hide placeholder

 
  const fetchUserData = async () => {
    try {
      const res = await axiosApi.get("bus-owner/update-profile");
      setCurrentUserData(res.data);
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
        {(
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
                  {( // for rendering change password button only for normal sign in
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
                className="d-flex flex-column p-3"
                style={{
                  width: "100%",
                  boxShadow: "0px 0px 22px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="container">
                <div className="row">

                <div className="col-sm-12 col-md-12 col-lg-3">
                  <CardText>Your name:</CardText>
                  <CardText as="h5">
                    {currentUserData["first_name"] +
                      " " +
                      (currentUserData["last_name"]
                        ? currentUserData["last_name"]
                        : "")}
                  </CardText>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-9">
                  <CardText>Company name:</CardText>
                  <CardText as="h5">
                    {currentUserData["company_name"]}
                  </CardText>
                </div>
                </div>
                </div>
                <div className="d-flex mt-3">
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
                  <Link to="/BusHome/update-owner">
                <button
                  className="btn btn-primary m-3"
                  style={{ width: "100%", height: "58%" }} // Set width and height here
                >
                  Update Profile
                </button>
                
              </Link>&nbsp;
              <Link to="/BusHome/change-password">
                <button 
                  className="btn btn-primary m-3"
                  style={{ width: "100%", height: "58%" }} // Set width and height here
                >
                  Change Password
                </button>
              </Link>
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
