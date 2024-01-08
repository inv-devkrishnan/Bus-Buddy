import { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Placeholder from "react-bootstrap/Placeholder";

import AdminProfileSplash from "../../assets/images/adminProfileView.png";
import { axiosApi } from "../../utils/axiosApi";
import ChangePassword from "../../pages/ChangePassword";

import UpdateProfile from "./UpdateProfile";

function ProfileView() {
  const [adminDetails, setAdminDetails] = useState(); // to store admin profile details
  const [showChangePassword, setShowChangePassword] = useState(false); // to show/hide Change password component
  const [showProfile, setShowProfile] = useState(true); // to show/hide showProfile component
  const [showUpdateProfile, setShowUpdateProfile] = useState(false); // to show/hide  updateProfile component
  const [isProfileLoading, setIsProfileLoading] = useState(false); // to show/hide placeholder
  useEffect(() => {
    getprofiledata();
  }, [showProfile]);

  const getprofiledata = async () => {
    // function to get profile data from backend
    setIsProfileLoading(true);
    await axiosApi
      .get("adminstrator/update-profile/")
      .then((result) => {
        setAdminDetails(result.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    setIsProfileLoading(false);
  };

  const showOnlyChangePassword = () => {
    // shows the change password component when clicked
    setShowChangePassword(true);
    setShowProfile(false);
    setShowUpdateProfile(false);
  };

  const showOnlyUpdateProfile = () => {
    // shows the update profile component when clicked
    setShowChangePassword(false);
    setShowProfile(false);
    setShowUpdateProfile(true);
  };
  const showOnlyProfile = () => {
    // shows the profile component when clicked
    setShowChangePassword(false);
    setShowProfile(true);
    setShowUpdateProfile(false);
  };
  return (
    <Container className="ms-2 mt-2">
      {showProfile && (
        <>
          <h1 className="ms-3">Admin Profile</h1>
          <Container>
            <Row>
              <Col className="mt-5">
                {isProfileLoading ? (
                  <Card className="p-5 shadow-lg w-100">
                    <Card.Body>
                      <Placeholder as={Card.Text} animation="glow">
                        <Placeholder xs={12} />
                        <Placeholder xs={8} />
                        <Placeholder xs={12} />
                        <Placeholder xs={8} />
                      </Placeholder>
                    </Card.Body>
                    <div className="d-flex">
                      <Placeholder.Button
                        variant="primary"
                        xs={6}
                        className="me-2"
                      />
                      <Placeholder.Button variant="primary" xs={6} />
                    </div>
                  </Card>
                ) : (
                  <Card className="p-5 shadow-lg w-100">
                    <Card.Text>
                      First Name : {adminDetails?.first_name}
                    </Card.Text>
                    <Card.Text>Last Name : {adminDetails?.last_name}</Card.Text>
                    <Card.Text>Email : {adminDetails?.email}</Card.Text>
                    <Card.Text>Phone : {adminDetails?.phone}</Card.Text>
                    <div className="d-flex">
                      <Button className="me-2" onClick={showOnlyChangePassword}>
                        Change Password
                      </Button>
                      <Button onClick={showOnlyUpdateProfile}>
                        Update Profile
                      </Button>
                    </div>
                  </Card>
                )}
              </Col>
              <Col className="ms-5">
                <Image
                  fluid
                  src={AdminProfileSplash}
                  alt="admin_splash"
                ></Image>
              </Col>
            </Row>
          </Container>
        </>
      )}
      {showChangePassword && <ChangePassword />}
      {showUpdateProfile && (
        <UpdateProfile
          adminDetails={adminDetails}
          showOnlyProfile={showOnlyProfile}
        />
      )}
      {!showProfile && <Button onClick={showOnlyProfile}>Go Back</Button>}
    </Container>
  );
}
export default ProfileView;
