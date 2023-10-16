import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Swal from "sweetalert2";
import registerImage from "../assets/register.jpg";
import { useFormik } from "formik";
import { RegistrationSchema } from "./RegistrationSchema";
import axios from "axios";

export default function RegisterCard() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = () => {
    axios
      .post("http://127.0.0.1:8000/user/registration/", {
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
    },
    validationSchema: RegistrationSchema,
    onSubmit,
  });

  const { resetForm } = formik;
  const handleClear = () => {
    resetForm();
  };

  return (
    <>
      <Card style={{ width: "55rem" }}>
        <Container>
          <Row>
            <Col>
              <Card.Img
                style={{ alignContent: "flex-start" }}
                src={registerImage}
                alt="register"
              />
            </Col>
            <Col>
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
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
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
                        isInvalid={
                          formik.touched.password && formik.errors.password
                        }
                        placeholder="Enter password"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={handleClickShowPassword}
                      >
                        Show
                      </Button>
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
                        isInvalid={
                          formik.touched.confirmPassword &&
                          formik.errors.confirmPassword
                        }
                        placeholder="Confirm password"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={handleClickShowConfirmPassword}
                      >
                        Show
                      </Button>
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
                        variant="primary"
                        type="submit"
                        style={{ margin: "4px" }}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="secondary"
                        style={{ margin: "4px" }}
                        onClick={handleClear}
                      >
                        Clear
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Col>
          </Row>
        </Container>
      </Card>
    </>
  );
}
