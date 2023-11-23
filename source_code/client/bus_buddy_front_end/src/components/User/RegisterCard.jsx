import React, { useState } from "react";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import { ShieldLockFill, Eye, EyeSlash } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { useFormik } from "formik";

import { RegistrationSchema } from "./RegistrationSchema";
import { openAxiosApi } from "../../utils/axiosApi";

export default function RegisterCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [swalText, setSwalText] = useState("");

  const onSubmit = () => {
    openAxiosApi
      .post("user/registration/", {
        first_name: formik.values.firstName,
        last_name: formik.values.lastName,
        email: formik.values.email,
        password: formik.values.password,
        phone: formik.values.phone,
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
          setSwalText("Email and phone is already registered");
        } else if (err.response.data.email) {
          setSwalText(err.response.data.email);
        } else {
          setSwalText(err.response.data.phone);
        }

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: swalText,
        });
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
    },
    validationSchema: RegistrationSchema,
    onSubmit,
  });

  const { resetForm } = formik;
  const handleClear = () => {
    resetForm();
  };

  return (
    <Card
      className="p-5 shadow-lg p-3 mb-5 mt-5 bg-body rounded"
      style={{ width: "30rem", padding: 5, alignItems: "center" }}
    >
      <Card.Title>
        Sign Up <ShieldLockFill color="cornflowerblue" />
      </Card.Title>
      <Card.Body>
        <Form onSubmit={formik.handleSubmit} id="userRegisterForm">
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
                  isInvalid={formik.touched.lastName && formik.errors.lastName}
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
              type="email"
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
                isInvalid={formik.touched.password && formik.errors.password}
                placeholder="Enter password"
              />{" "}
              <InputGroup.Text
                id="basic-addon1"
                onClick={() => {
                  showPassword ? setShowPassword(false) : setShowPassword(true);
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
          <Row>
            <Col>
              <Button variant="primary" type="submit" style={{ margin: "5x" }}>
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
    </Card>
  );
}
