import Swal from "sweetalert2";
import { React, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { Formik, Field } from "formik";
import { UpdateSchema } from "./UpdateSchema";
import { axiosApi } from "../../utils/axiosApi";

export default function UpdateForm() {
  const [currentUserData, setCurrentUserData] = useState([]);

  const onSubmit = (values) => {
    axiosApi
      .put("user/update-profile", values)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire("Success!", "Updated successfully!", "success");
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err.response);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            err.response.data.email ||
            err.response.data.phone ||
            err.response.data.email + err.response.data.phone,
        });
      });
  };

  const handleClear = (values, { resetForm }) => {
    resetForm();
  };

  useEffect(() => {
    axiosApi
      .get("user/update-profile")
      .then((res) => {
        setCurrentUserData(res.data);
      })
      .catch((err) => {
        console.log(err.response);
        alert("User does not exist!!");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card
      className="d-grid gap-1 gap-md-2 gap-lg-3 gap-xl-3 p-2 mb-2 bg-body rounded"
      style={{
        boxShadow: "0px 0px 22px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Card.Body>
        <Formik
          initialValues={{
            first_name: currentUserData["first_name"],
            last_name: currentUserData["last_name"],
            email: currentUserData["email"],
            phone: currentUserData["phone"],
          }}
          validationSchema={UpdateSchema}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {(formikProps) => (
            <Form onSubmit={formikProps.handleSubmit} id="userRegisterForm">
              <Form.Group className="mb-3">
                <Form.Label>First name</Form.Label>
                <Field
                  as={Form.Control}
                  name="first_name"
                  id="first_name"
                  placeholder="Enter first name"
                  maxLength={100}
                  isInvalid={
                    formikProps.touched.first_name &&
                    formikProps.errors.first_name
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formikProps.errors.first_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last name</Form.Label>
                <Field
                  as={Form.Control}
                  name="last_name"
                  id="last_name"
                  placeholder="Enter last name"
                  maxLength={100}
                  isInvalid={
                    formikProps.touched.last_name &&
                    formikProps.errors.last_name
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formikProps.errors.last_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Field
                  as={Form.Control}
                  name="email"
                  id="email"
                  maxLength={100}
                  isInvalid={
                    formikProps.touched.email && formikProps.errors.email
                  }
                  placeholder="Enter email"
                />
                <Form.Control.Feedback type="invalid">
                  {formikProps.errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone number</Form.Label>
                <Field
                  as={Form.Control}
                  name="phone"
                  id="phone"
                  maxLength={10}
                  isInvalid={
                    formikProps.touched.phone && formikProps.errors.phone
                  }
                  placeholder="Phone number"
                />
                <Form.Control.Feedback type="invalid">
                  {formikProps.errors.phone}
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit" style={{ margin: "4px" }}>
                Submit
              </Button>
              <Button
                variant="secondary"
                style={{ margin: "4px" }}
                onClick={() => handleClear(formikProps.values, formikProps)}
              >
                Clear
              </Button>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
}
