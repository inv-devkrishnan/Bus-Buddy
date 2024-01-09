import { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Placeholder from "react-bootstrap/Placeholder";

import AdminProfileSplash from "../../../assets/images/adminProfileView.png";
import { axiosApi } from "../../../utils/axiosApi";
import { useNavigate } from "react-router-dom";

function ProfileView() {
  const [adminDetails, setAdminDetails] = useState(); // to store admin profile details
  const [isProfileLoading, setIsProfileLoading] = useState(false); // to show/hide placeholder
  const navigate = useNavigate();
  useEffect(() => {
    getprofiledata();
  }, []);

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
  return (
    <Container className="ms-2 mt-2">
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
                <Card.Text>First Name : {adminDetails?.first_name}</Card.Text>
                <Card.Text>Last Name : {adminDetails?.last_name}</Card.Text>
                <Card.Text>Email : {adminDetails?.email}</Card.Text>
                <Card.Text>Phone : {adminDetails?.phone}</Card.Text>
                <div className="d-flex">
                  <Button
                    className="me-2"
                    onClick={() => {
                      navigate("/admin-dashboard/view-profile/change-password");
                    }}
                  >
                    Change Password
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/admin-dashboard/view-profile/update");
                    }}
                  >
                    Update Profile
                  </Button>
                </div>
              </Card>
            )}
          </Col>
          <Col className="ms-5">
            <Image fluid src={AdminProfileSplash} alt="admin_splash"></Image>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default ProfileView;
