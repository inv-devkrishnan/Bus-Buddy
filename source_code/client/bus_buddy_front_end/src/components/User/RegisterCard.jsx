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
        console.log(res);
        if (res.status === 201) {
          Swal.fire("Success!", "Registered successfully!", "success");
          resetForm();
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data?.email && err.response?.data?.phone) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Email and phone are required",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
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
      className="shadow-lg bg-body rounded m-2 p-3"
      style={{ width: "80%" }}
    >
      <Card.Title>
        Sign Up <ShieldLockFill color="cornflowerblue" />
      </Card.Title>
      <Card.Body>
        <Form onSubmit={formik.handleSubmit} id="userRegisterForm">
          <Row>
            <div className="d-flex flex-column flex-md-row flex-lg-row">
              <Form.Group className="me-1 mb-3" controlId="firstName">
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

              <Form.Group className="ms-1 mb-3" controlId="lastName">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  name="lastName"
                  type="text"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.lastName && formik.errors.lastName}
                  placeholder="Enter last name"
                  maxLength={100}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
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
                isInvalid={formik.touched.password && formik.errors.password}
                placeholder="Enter password"
                maxLength={20}
              />
              <InputGroup.Text
                data-testid="show-password"
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
          <Row>
            <Col>
              <Button
                data-testid="submit_button"
                variant="primary"
                type="submit"
                style={{ margin: "5x" }}
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
    </Card>
  );
}
