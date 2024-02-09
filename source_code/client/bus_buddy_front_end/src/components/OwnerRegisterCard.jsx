import { React, useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import { ShieldLockFill, Eye, EyeSlash } from "react-bootstrap-icons";
import { useFormik } from "formik";
import { OwnerRegistrationSchema } from "./OwnerRegistrationSchema";
import { openAxiosApi } from "../utils/axiosApi";
import Swal from "sweetalert2";
import EmailVerification from "./common/EmailVerification";

export default function OwnerRegisterCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] =
    useState(false);
  const [ownerValues, setOwnerValues] = useState([]);

  const registerOwner = (values) => {
    openAxiosApi
      .post("bus-owner/registration/", values)
      .then((res) => {
        if (res.status === 201) {
          Swal.close();
          Swal.fire("Success!", "Registered successfully!", "success");
          resetForm();
        }
      })
      .catch((err) => {
        Swal.close();
        console.log(err.response);
        let message;
        if (err.response?.data?.phone) {
          message = "Phone is already registered";
        } else if (err.response?.data?.email) {
          message = "Email is already registered";
        } else if (err.response?.data?.aadhaar_no) {
          message = "Aadhaar is already registered";
        } else if (err.response?.data?.msme_no) {
          message = "Msme is already registered";
        } else {
          message = "Something went wrong!";
        }

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: message,
        });
      });
  };

  const onSubmit = (values) => {
    const data = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      password: values.password,
      phone: values.phone,
      company_name: values.companyName,
      aadhaar_no: values.aadhaar,
      msme_no: values.msme,
      extra_charges: values.extraCharges,
    };
    setOwnerValues(data);
    setShowEmailVerificationModal(true);
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      companyName: "",
      aadhaar: "",
      msme: "",
      extraCharges: "",
    },
    validationSchema: OwnerRegistrationSchema,
    onSubmit,
  });

  const { resetForm } = formik;
  const handleClear = () => {
    resetForm();
  };

  return (
    <>
      <Card
        className="d-grid gap-1 gap-md-2 gap-lg-3 gap-xl-3 p-4 p-3 mt-3 mb-3 bg-body rounded"
        style={{
          boxShadow: "0px 0px 22px 4px rgba(0, 0, 0, 0.1)",
          height: "35rem",
          overflowY: "scroll",
        }}
      >
        <Card.Title className="d-flex justify-content-center align-items-center">
          Sign Up <ShieldLockFill color="cornflowerblue" />
        </Card.Title>
        <Col>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit} id="ownerRegisterForm">
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                      name="firstName"
                      type="text"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.firstName && formik.errors.firstName
                      }
                      placeholder="Enter first name"
                      maxLength={100}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3" controlId="lastName">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                      name="lastName"
                      type="text"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.lastName && formik.errors.lastName
                      }
                      placeholder="Enter last name"
                      maxLength={100}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  name="email"
                  type="temailext"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.email && formik.errors.email}
                  placeholder="Enter email"
                  maxLength={100}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.password && formik.errors.password
                    }
                    placeholder="Enter password"
                    maxLength={20}
                  />
                  <InputGroup.Text
                    data-testid="show-password"
                    onClick={() => {
                      showPassword
                        ? setShowPassword(false)
                        : setShowPassword(true);
                    }}
                  >
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm password</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                    }
                    placeholder="Confirm password"
                    maxLength={20}
                  />
                  <InputGroup.Text
                    data-testid="confirm-show-password"
                    onClick={() => {
                      showConfirmPassword
                        ? setShowConfirmPassword(false)
                        : setShowConfirmPassword(true);
                    }}
                  >
                    {showConfirmPassword ? <EyeSlash /> : <Eye />}
                  </InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.confirmPassword}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>Phone number</Form.Label>
                <Form.Control
                  name="phone"
                  type="text"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.phone && formik.errors.phone}
                  maxLength={10}
                  placeholder="Phone number"
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.phone}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="companyName">
                <Form.Label>Company name</Form.Label>
                <Form.Control
                  name="companyName"
                  type="text"
                  value={formik.values.companyName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.companyName && formik.errors.companyName
                  }
                  placeholder="Enter the company name"
                  maxLength={100}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.companyName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="aadhaar">
                <Form.Label>Aadhaar number</Form.Label>
                <Form.Control
                  name="aadhaar"
                  type="text"
                  maxLength={12}
                  value={formik.values.aadhaar}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.aadhaar && formik.errors.aadhaar}
                  placeholder="Aadhaar number"
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.aadhaar}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="msme">
                <Form.Label>MSME number</Form.Label>
                <Form.Control
                  name="msme"
                  type="text"
                  value={formik.values.msme}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.msme && formik.errors.msme}
                  placeholder="MSME number"
                  maxLength={19}
                />
                <Form.Text className="text-muted">
                  Udyam number of your company (Example: UDYAM-XX-00-0000000)
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.msme}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="extraCharges">
                <Form.Label>GST</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    name="extraCharges"
                    type="text"
                    value={formik.values.extraCharges}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.extraCharges && formik.errors.extraCharges
                    }
                    placeholder="GST charges by the company"
                    max={100}
                    min={0}
                  />

                  <InputGroup.Text id="basic-addon1">%</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.extraCharges}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Row>
                <Col className="d-flex justify-content-center align-items-center">
                  <Button
                    variant="primary"
                    type="submit"
                    style={{ margin: "5px" }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="secondary"
                    style={{ margin: "5px" }}
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                </Col>
              </Row>
            </Form>
            <Card.Text className="d-flex justify-content-center align-items-center">
              Already have an account?
              <Link to="/login" style={{ textDecoration: "none" }}>
                Login
              </Link>
            </Card.Text>
          </Card.Body>
        </Col>
      </Card>

      <EmailVerification
        show={showEmailVerificationModal}
        setShow={setShowEmailVerificationModal}
        values={ownerValues}
        afterFunction={registerOwner}
        alertMessage={"Registering"}
      />
    </>
  );
}
