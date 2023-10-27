import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import AdminProfileSplash from "../../assets/images/adminProfileView.png";
import { useEffect, useState } from "react";
import { axiosApi } from "../../utils/axiosApi";
import ChangePassword from "../../pages/ChangePassword";
import UpdateProfile from "./UpdateProfile";
import { useNavigate } from "react-router-dom";

function ProfileView() {
  const [adminDetails, setAdminDetails] = useState();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showProfile, setShowProfile] = useState(true);
  const [showUpdateProfile, setshowUpdateProfile] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
      getprofiledata();
  }, [showProfile,navigate]);

  const getprofiledata = () => {
    // function to get profile data from backend
    axiosApi
      .get("adminstrator/update-profile/")
      .then((result) => {
        setAdminDetails(result.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const showOnlyChangePassword = () => {
    // shows the change password component when clicked
    setShowChangePassword(true);
    setShowProfile(false);
    setshowUpdateProfile(false);
  };

  const showOnlyUpdateProfile = () => {
    // shows the update profile component when clicked
    setShowChangePassword(false);
    setShowProfile(false);
    setshowUpdateProfile(true);
  };
  const showOnlyProfile = () => {
    // shows the profile component when clicked
    setShowChangePassword(false);
    setShowProfile(true);
    setshowUpdateProfile(false);
  };
  return (
    <Container className="ms-2 mt-2">
      {showProfile && (
        <>
          <h1 className="ms-3">Admin Profile</h1>
          <Container>
            <Row>
              <Col className="mt-5">
                <Card className="p-5 shadow-lg">
                  <Card.Text>First Name : {adminDetails?.first_name}</Card.Text>
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
              </Col>
              <Col className="ms-5">
                <img src={AdminProfileSplash} alt="admin_splash"></img>
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
