import React, { useState } from "react";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { ShieldLockFill, Eye, EyeSlash } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { Formik, Field, ErrorMessage } from "formik";

import { RegistrationSchema } from "./RegistrationSchema";
import { openAxiosApi } from "../../utils/axiosApi";

export default function RegisterCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (values, actions) => {
    console.log(values);
    openAxiosApi
      .post("user/registration/", values)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          Swal.fire("Success!", "Registered successfully!", "success");
          actions.resetForm();
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

  const handleClear = (values, { resetForm }) => {
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
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
          }}
          validationSchema={RegistrationSchema}
          onSubmit={onSubmit}
        >
          {(formikProps) => (
            <Form onSubmit={formikProps.handleSubmit} id="userRegisterForm">
              <Row>
                <div className="d-flex flex-column flex-md-row flex-lg-row">
                  <Form.Group className="me-1 mb-3">
                    <Form.Label>First name</Form.Label>
                    <Field
                      as={Form.Control}
                      name="first_name"
                      id="first_name"
                      placeholder="Enter first name"
                      maxLength={100}
                      isInvalid={
                        formikProps.errors.first_name &&
                        formikProps.touched.first_name
                      }
                    />

                    <ErrorMessage
                      component="span"
                      name="first_name"
                      style={{ color: "red" }}
                    />
                  </Form.Group>

                  <Form.Group className="ms-1 mb-3">
                    <Form.Label>Last name</Form.Label>
                    <Field
                      as={Form.Control}
                      name="last_name"
                      id="last_name"
                      placeholder="Enter last name"
                      maxLength={100}
                      isInvalid={
                        formikProps.errors.last_name &&
                        formikProps.touched.last_name
                      }
                    />

                    <ErrorMessage
                      component="span"
                      name="lastName"
                      style={{ color: "red" }}
                    />
                  </Form.Group>
                </div>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Field
                  as={Form.Control}
                  name="email"
                  id="email"
                  placeholder="Enter email"
                  maxLength={100}
                  isInvalid={
                    formikProps.errors.email && formikProps.touched.email
                  }
                />

                <ErrorMessage
                  component="span"
                  name="email"
                  style={{ color: "red" }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formikProps.values.password}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    isInvalid={
                      formikProps.touched.password &&
                      formikProps.errors.password
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
                </InputGroup>

                <ErrorMessage
                  component="span"
                  name="password"
                  style={{ color: "red" }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm password</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formikProps.values.confirmPassword}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    isInvalid={
                      formikProps.touched.confirmPassword &&
                      formikProps.errors.confirmPassword
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
                </InputGroup>

                <ErrorMessage
                  component="span"
                  name="confirmPassword"
                  style={{ color: "red" }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone number</Form.Label>
                <Field
                  as={Form.Control}
                  name="phone"
                  id="phone"
                  placeholder="Phone number"
                  maxLength={10}
                  isInvalid={
                    formikProps.errors.phone && formikProps.touched.phone
                  }
                />

                <ErrorMessage
                  component="span"
                  name="phone"
                  style={{ color: "red" }}
                />
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
                    onClick={() => handleClear(formikProps.values, formikProps)}
                  >
                    Clear
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>

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
