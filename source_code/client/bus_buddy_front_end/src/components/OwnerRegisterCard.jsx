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
import { axiosApi } from "../utils/axiosApi";
import Swal from "sweetalert2";

export default function OwnerRegisterCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = () => {
    axiosApi
      .post("bus-owner/registration/", {
        first_name: formik.values.firstName,
        last_name: formik.values.lastName,
        email: formik.values.email,
        password: formik.values.password,
        phone: formik.values.phone,
        company_name: formik.values.companyName,
        aadhaar_no: formik.values.aadhaar,
        msme_no: formik.values.msme,
        extra_charges: formik.values.extraCharges,
      })
      .then((res) => {
        if (res.status === 201) {
          Swal.fire("Success!", "Registered successfully!", "success");
          resetForm();
        }
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data.email && err.response.data.phone) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Email and phone is already registered",
          });
        } else if (err.response.data.email) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response.data.email,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response.data.phone,
          });
        }
      });
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
        className="p-5 shadow-lg p-3 mb-5 mt-5 bg-body rounded"
        style={{ width: "45rem", padding: 5, alignItems: "center" }}
      >
        <Card.Title>
          Sign Up <ShieldLockFill color="cornflowerblue" />
        </Card.Title>
        <Col>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit} id="ownerRegisterForm">
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>Fisrt name</Form.Label>
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
                  />
                  <InputGroup.Text
                    id="basic-addon1"
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
                  />
                  <InputGroup.Text
                    id="basic-addon1"
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
                <Form.Label>Comapny name</Form.Label>
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
                  placeholder="Adhaar number"
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.companyName}
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
                />
                <Form.Text className="text-muted">
                  Udyan number of your company
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.msme}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="extraCharges">
                <Form.Label>Charge by the company</Form.Label>
                <Form.Control
                  name="extraCharges"
                  type="number"
                  value={formik.values.extraCharges}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.extraCharges && formik.errors.extraCharges
                  }
                  placeholder="Extra charges"
                />
                <Form.Text className="text-muted">
                  Extra charge is the service charge by the company
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.extraCharges}
                </Form.Control.Feedback>
              </Form.Group>
              <Row>
                <Col>
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
            <Card.Text style={{ alignContent: "center" }}>
              Already have an account?
              <Link to="/login" style={{ textDecoration: "none" }}>
                Login
              </Link>
            </Card.Text>
          </Card.Body>
        </Col>
      </Card>
    </>
  );
}
