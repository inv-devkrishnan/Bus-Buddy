import Swal from "sweetalert2";
import { React, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import updateImage from "../assets/update.jpg";
import { useFormik } from "formik";
import { UpdateSchema } from "./UpdateSchema";
import axios from "axios";

export default function UpdateForm() {
  const [currentUserData, setCurrentUserData] = useState([])
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/user/update-profile/31")
      .then((res) => {
        console.log(res.data);
        setCurrentUserData(res.data)
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  const onSubmit = () => {
    axios
      .put("http://127.0.0.1:8000/user/update-profile/31", {
        first_name: formik.values.firstName,
        last_name: formik.values.lastName,
        email: formik.values.email,
        password: formik.values.password,
        phone: formik.values.phone,
      })
      .then((res) => {
        if (res.status === 200) {
          Swal.fire("Success!", "Updated successfully!", "success");
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
      firstName: currentUserData["first_name"],
      lastName: currentUserData["last_name"],
      email: currentUserData["email"],
      phone: currentUserData["phone"],
    },
    validationSchema: UpdateSchema,
    onSubmit,
  });

  const { resetForm } = formik;
  const handleClear = () => {
    resetForm();
  };

  return (
    <>
      <Card style={{ width: "50rem" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Card.Img
            variant="top"
            src={updateImage}
            style={{ width: "20rem", height: "auto" }}
          />
          <div>
            <Card.Title style={{ fontSize: "40px", fontWeight: "bold" }}>
              Update Profile
            </Card.Title>
            <Card.Text style={{ color: "gray" }}>
              Keep your information current and accurate.
            </Card.Text>
          </div>
        </div>
        <Card.Body>
          <Form onSubmit={formik.handleSubmit} id="userRegisterForm">
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                name="firstName"
                type="text"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.firstName && formik.errors.firstName}
                placeholder="Enter first name"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
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
            <Button variant="primary" type="submit" style={{ margin: "4px" }}>
              Submit
            </Button>
            <Button
              variant="secondary"
              style={{ margin: "4px" }}
              onClick={handleClear}
            >
              Clear
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
