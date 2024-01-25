import Swal from "sweetalert2";
import { React, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useFormik } from "formik";
import { OwnerUpdationSchema } from "./OwmerUpdationSchema";
import { axiosApi } from "../utils/axiosApi";

export default function OwnerUpdateForm() {
  const [currentUserData, setCurrentUserData] = useState([]);
  useEffect(() => {
    axiosApi
      .get("bus-owner/update-profile")
      .then((res) => {
        setCurrentUserData(res.data);
      })
      .catch((err) => {
        console.log(err.response);
        alert("User does not exist!!");
      });
  }, []);

  useEffect(() => {
    formik.setValues({
      firstName: currentUserData["first_name"],
      lastName: currentUserData["last_name"],
      email: currentUserData["email"],
      phone: currentUserData["phone"],
      companyName: currentUserData["company_name"],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserData]);

  const onSubmit = () => {
    axiosApi
      .put("bus-owner/update-profile", {
        first_name: formik.values.firstName,
        last_name: formik.values.lastName,
        email: formik.values.email,
        phone: formik.values.phone,
        company_name: formik.values.companyName,
      })
      .then((res) => {
        if (res.status === 200) {
          Swal.fire("Success!", "Updated successfully!", "success");
          resetForm();
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        const errorMessage = error(
          err.response?.data?.email,
          err.response?.data?.phone
        );

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage,
        });
      });
  };

  const error = (email, phone) => {
    if (email && phone) {
      return "Email and phone is already registered";
    } else if (email) {
      return "Email is already registered";
    } else if (phone) {
      return "Phone is already registered";
    } else {
      return "Something went wrong";
    }
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
    validationSchema: OwnerUpdationSchema,
    onSubmit,
  });

  const { resetForm } = formik;
  const handleClear = () => {
    resetForm();
  };

  return (
    <Card style={{ width: "50rem" }}>
      <Card.Body>
        <Form onSubmit={formik.handleSubmit} id="ownerRegisterForm">
          <Form.Group className="mb-3" controlId="firstName">
            <Form.Label>First name</Form.Label>
            <Form.Control
              name="firstName"
              type="text"
              value={formik.values.firstName || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.firstName && formik.errors.firstName}
              placeholder="Enter first name"
              maxLength={100}
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
              value={formik.values.lastName || ""}
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

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              name="email"
              type="temailext"
              value={formik.values.email || ""}
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
          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Phone number</Form.Label>
            <Form.Control
              name="phone"
              type="text"
              value={formik.values.phone || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.phone && formik.errors.phone}
              maxLength={10}
              minLength={10}
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
              value={formik.values.companyName || ""}
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
  );
}
