import { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
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
    <Container className="ms-0 ps-0 mt-2">
      <Container>
        <Row>
          <Col>
            <h1>My Profile</h1>
          </Col>
        </Row>
        <Row>
          <Col xl={12} lg={12} className="mt-5">
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
                <div className="d-flex justify-content-end">
                  <Placeholder.Button
                    variant="primary"
                    xs={2}
                    className="me-2"
                  />
                  <Placeholder.Button variant="primary" xs={2} />
                </div>
              </Card>
            ) : (
              <Card className="p-4 mb-5 shadow-lg w-100">
                <Container className="m-0 p-0">
                  <Row>
                    <Col>
                      <Card.Text>
                        Your Name :<br></br>{" "}
                        <span>
                          <Card.Title className="mt-2">
                            {adminDetails?.first_name} {adminDetails?.last_name}{" "}
                          </Card.Title>{" "}
                        </span>
                      </Card.Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Card.Text className="text-secondary mt-2 mb-2">
                        Contact Details :
                      </Card.Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Card.Text>
                        Phone number :<br></br>{" "}
                        <span>
                          <Card.Title className="mt-2">
                            {adminDetails?.phone}
                          </Card.Title>{" "}
                        </span>
                      </Card.Text>
                    </Col>
                    <Col>
                      <Card.Text>
                        Email :<br></br>{" "}
                        <span>
                          <Card.Title className="mt-2">
                            {adminDetails?.email}
                          </Card.Title>{" "}
                        </span>
                      </Card.Text>
                    </Col>
                  </Row>
                  <Row className="d-flex justify-content-end">
                    <Col
                      className="d-flex justify-content-end"
                      sm={12}
                      md={"auto"}
                    >
                      <Button
                        className="mt-1"
                        onClick={() => {
                          navigate(
                            "/admin-dashboard/view-profile/change-password"
                          );
                        }}
                      >
                        Change Password
                      </Button>
                    </Col>
                    <Col
                      className="d-flex justify-content-end"
                      sm={12}
                      md={"auto"}
                    >
                      <Button
                        className="mt-1"
                        onClick={() => {
                          navigate("/admin-dashboard/view-profile/update");
                        }}
                      >
                        Edit
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default ProfileView;
