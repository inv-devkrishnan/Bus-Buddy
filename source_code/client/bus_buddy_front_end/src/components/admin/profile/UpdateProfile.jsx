import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import Placeholder from "react-bootstrap/Placeholder";
import { Formik } from "formik";
import Swal from "sweetalert2";
import AdminProfileSplash from "../../../assets/images/adminProfileView.png";
import { axiosApi } from "../../../utils/axiosApi";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { showLoadingAlert } from "../../common/loading_alert/LoadingAlert";
import { UserContext } from "../../User/UserContext";

function UpdateProfile() {
  // updates the profile when executed
  const [showModal, setShowModal] = useState(false);
  const { updateFirstName } = useContext(UserContext);
  const [charges, setCharges] = useState("");
  const message =
    "Platform charges are expected in % and should be in range 0 - 100";
  const [adminDetails, setAdminDetails] = useState({});
  const [isProfileLoading, setIsProfileLoading] = useState(false); // to show/hide placeholder
  const navigate = useNavigate();

  useEffect(() => {
    get_profile_data();
  }, []);
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const get_profile_data = async () => {
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

  const handleShowModal = () => {
    setShowModal(true);
  };
  const update_profile = async (values) => {
    showLoadingAlert("Updating Profile");
    await axiosApi
      .put("adminstrator/update-profile/", values)
      .then((result) => {
        Swal.close();
        Swal.fire({
          icon: "success",
          title: "Profile Updated !",
        });
        updateFirstName(values.first_name);
        localStorage.setItem("user_name",values.first_name)
        navigate("/admin-dashboard/view-profile");
      })
      .catch(function (error) {
        Swal.close();
        console.log(error)
        Swal.fire({
          icon: "error",
          title: "Profile Update Failed !",
          text: getErrorMessage(error?.response?.data?.error_code),
        });
      });
  };
  const handleUpdatePlatformCharges = (charges) => {
    if (!charges) {
      alert("Platform charges cannot be null");
      return;
    }
    if (isNaN(charges)) {
      alert("Platform charges must be a number");
      return;
    }
    if (charges < 0 || charges > 100) {
      alert("Platform charges are in % and should be in range 0 - 100");
      return;
    }
    const platformcharges = parseFloat(charges);
    axiosApi
      .put("account/platformcharges/", { extra_charges: platformcharges })
      .then((response) => {
        console.log(response.data);
        console.log("Platform charges updated successfully");
        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          text: "Platform charges updated successfully",
        });
      })
      .catch((error) => {
        console.error("Error updating platform charges:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error updating platform charges",
        });
      });

    setShowModal(false);
  };
  return (
    <Container className="ms-3 p-0">
      <Row>
        <Col xs={11} sm={12} md={8} lg={6} xl={5} xxl={4}>
          {!isProfileLoading ? (
            <Card className="p-5 pt-3 mt-2 mb-5 shadow-lg w-100">
              <Card.Title className="mb-4">Update Profile</Card.Title>
              <Formik
                // filling initial from props
                initialValues={{
                  first_name: adminDetails?.first_name,
                  last_name: adminDetails?.last_name,
                  email: adminDetails?.email,
                  phone: adminDetails?.phone,
                }}
                validate={(values) => {
                  // validation for email,first_name,last_name,phone number
                  const errors = {};

                  if (!values.email) {
                    errors.email = "Required";
                  } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                      values.email
                    )
                  ) {
                    errors.email = "Invalid email address";
                  }
                  if (!values.first_name) {
                    errors.first_name = "Required";
                  } else if (!/^[A-Z]+$/i.test(values.first_name)) {
                    errors.first_name =
                      "Invalid first name (only alphabets allowed)";
                  }
                  if (!values.last_name) {
                    errors.last_name = "Required";
                  } else if (!/^[A-Z]+$/i.test(values.last_name)) {
                    errors.last_name =
                      "Invalid last name (only alphabets allowed)";
                  }
                  if (!values.phone) {
                    errors.phone = "Required";
                  } else if (!/^\d+$/i.test(values.phone)) {
                    errors.phone = "Invalid phone number";
                  } else if (values.phone.length !== 10) {
                    errors.phone = "Phone number should be 10 digits";
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    console.log(values);
                    update_profile(values);
                    setSubmitting(false);
                  }, 400);
                }}
              >
                {({
                  values,

                  errors,

                  touched,

                  handleChange,

                  handleBlur,

                  handleSubmit,

                  isSubmitting,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        data-testid="first-name"
                        name="first_name"
                        value={values.first_name}
                        maxLength={100}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="First Name"
                      />
                      <p className="text-danger">
                        {errors.first_name &&
                          touched.first_name &&
                          errors.first_name}
                      </p>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        name="last_name"
                        type="text"
                        data-testid="last-name"
                        value={values.last_name}
                        maxLength={100}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Last Name"
                      />
                      <p className="text-danger">
                        {errors.last_name &&
                          touched.last_name &&
                          errors.last_name}
                      </p>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        name="email"
                        type="email"
                        value={values.email}
                        data-testid="email"
                        maxLength={100}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter email"
                      />
                      <p className="text-danger">
                        {errors.email && touched.email && errors.email}
                      </p>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        name="phone"
                        type="text"
                        maxLength={10}
                        data-testid="phone"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Phone Number"
                      />
                      <p className="text-danger">
                        {errors.phone && touched.phone && errors.phone}
                      </p>
                    </Form.Group>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        style={{ width: "100%" }}
                        data-testid="update-profile"
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Update Profile
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
              <Card.Footer className="mt-2 ms-0 me-0 pe-0 ps-0">
                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    style={{ width: "100%" }}
                    onClick={handleShowModal}
                  >
                    Platform Charges
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          ) : (
            <Card className="p-5 pt-3 mt-2 mb-5 shadow-lg w-100">
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={12} />
              </Placeholder>
              <Placeholder as={Form.Group} animation="glow">
                <Placeholder xs={12} />
                <Placeholder xs={8} />
                <Placeholder xs={12} />
                <Placeholder xs={8} />
                <Placeholder xs={12} />
                <Placeholder xs={8} />
                <Placeholder xs={12} />
                <Placeholder xs={8} />
              </Placeholder>
              <Placeholder.Button className="h-25" animation="glow" xs={6} />
            </Card>
          )}
        </Col>
        <Col xs={12} lg={6} xl={7} xxl={8}>
          <Image
            fluid
            className="mt-5"
            src={AdminProfileSplash}
            alt="admin_splash"
          ></Image>
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal}>
        {/* Modal content goes here */}
        <Modal.Header closeButton>
          <Modal.Title>Update Platform Charges</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPlatformCharges">
              <Form.Label>Platform Charges</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter platform charges"
                value={charges}
                onChange={(e) => setCharges(e.target.value)}
              />
              {message && (
                <div style={{ color: "grey", fontSize: "13px" }}>{message}</div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleUpdatePlatformCharges(charges)}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
export default UpdateProfile;
