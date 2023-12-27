import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import Swal from "sweetalert2";
import AdminProfileSplash from "../../assets/images/adminProfileView.png";
import { axiosApi } from "../../utils/axiosApi";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useState } from "react";

function UpdateProfile(props) {
  // updates the profile when executed
  const [showModal, setShowModal] = useState(false);
  const [charges, setCharges] = useState("");
  const message = "Platform charges are expected in % and should be in range 0 - 100";
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };
  const update_profile = async (values) => {
    await axiosApi
      .put("adminstrator/update-profile/", values)
      .then((result) => {
        Swal.fire({
          icon: "success",
          title: "Profile Updated !",
        });

        props.showOnlyProfile();
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Profile Update Failed !",
          text: getErrorMessage(error?.response?.data?.error_code),
        });
      });
  };
  const handleUpdatePlatformCharges = (charges) => {
    if(!charges){
      alert("Platform charges cannot be null")
      return;
    }
    if (isNaN(charges)){
      alert("Platform charges must be a number")
      return;
    }
    const platformcharges = parseFloat(charges);
    axiosApi
      .put("account/platformcharges/", { extra_charges: platformcharges })
      .then((response) => {
        console.log(response.data)
        console.log("Platform charges updated successfully");
      })
      .catch((error) => {

        console.error("Error updating platform charges:", error);
      });

    setShowModal(false);
  };
  return (
    <Container>
      <Row>
        <Col xs={12} lg={8}>
          <h1>Update Profile</h1>
          <Card className="p-5 mt-5 mb-5 shadow-lg">
            <Formik
              // filling initial from props
              initialValues={{
                first_name: props.adminDetails.first_name,
                last_name: props.adminDetails.last_name,
                email: props.adminDetails.email,
                phone: props.adminDetails.phone,
              }}
              validate={(values) => {
                // validation for email,first_name,last_name,phone number
                const errors = {};

                if (!values.email) {
                  errors.email = "Required";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Invalid email address";
                }
                if (!values.first_name) {
                  errors.first_name = "Required";
                } else if (!/^[A-Z]+$/i.test(values.first_name)) {
                  errors.first_name = "Invalid first name";
                }
                if (!values.last_name) {
                  errors.last_name = "Required";
                } else if (!/^[A-Z]+$/i.test(values.last_name)) {
                  errors.last_name = "Invalid last name";
                }
                if (!values.phone) {
                  errors.phone = "Required";
                } else if (!/^\d+$/i.test(values.phone)) {
                  errors.phone = "Invalid phone Number";
                } else if (values.phone.length !== 10) {
                  errors.phone = "phone Number Should be 10 digits";
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
                      name="first_name"
                      value={values.first_name}
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
                      value={values.last_name}
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
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      style={{width:"150px"}}
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Update
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
            <div className="d-flex justify-content-end">
            <Button
                style={{ marginTop: "-38px" }}
                variant="primary"
                onClick={handleShowModal}
              >
                 Platform Charges
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={8} lg={4}>
          <Image
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
              {message && <div style={{ color: 'grey',fontSize:"13px" }}>{message}</div>}
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
