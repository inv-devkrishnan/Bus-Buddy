import { React, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useFormik } from "formik";
import { OwnerUpdationSchema } from "./OwmerUpdationSchema";
import { axiosApi } from "../utils/axiosApi";
import Swal from "sweetalert2";
import EmailVerification from "./common/EmailVerification";
import { UserContext } from "./User/UserContext";

export default function OwnerUpdateForm() {
  const [currentUserData, setCurrentUserData] = useState([]);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [updateValues, setUpdateValues] = useState([]);
  const [disable, setDisable] = useState(true);
  const { updateFirstName } = useContext(UserContext);

  const navigate = useNavigate();

  const UpdateOwner = (values) => {
    axiosApi
      .put("bus-owner/update-profile", values)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire("Success!", "Updated successfully!", "success");
          updateFirstName(values.first_name);
          navigate("/BusHome");
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        const errorMessage = error(
          err.response?.data?.email,
          err.response?.data?.phone,
          err.response?.data?.aadhaar_no,
          err.response?.data?.msme_no
        );

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage,
        });
      });
  };

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

  const onSubmit = (values) => {
    updateFirstName(values.first_name);
    localStorage.setItem("user_name", values.first_name);

    const data = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      phone: values.phone,
      company_name: values.companyName,
    };
    setUpdateValues(data);
    if (currentUserData["email"] !== values.email) {
      setShowEmailVerification(true);
    } else {
      UpdateOwner(data);
    }
  };

  const error = (email, phone, aadhar, msme) => {
    if (email) {
      return "Email is already registered";
    } else if (phone) {
      return "Phone is already registered";
    } else if (aadhar) {
      return "Aadhar is already registered";
    } else if (msme) {
      return "Msme is already registered";
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

  useEffect(() => {
    if (
      currentUserData["first_name"] !== formik.values.firstName ||
      currentUserData["last_name"] !== formik.values.lastName ||
      currentUserData["email"] !== formik.values.email ||
      currentUserData["phone"] !== formik.values.phone ||
      currentUserData["company_name"] !== formik.values.companyName
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [
    currentUserData,
    formik.values.companyName,
    formik.values.email,
    formik.values.firstName,
    formik.values.lastName,
    formik.values.phone,
  ]);

  return (
    <>
    <div className="mb-auto p-2 bd-highlight m-3">
        <h1>Update Profile</h1>
      </div>
      <Card style={{ width: "50%" }}>
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
            <Button
              variant="primary"
              type="submit"
              style={{ margin: "4px" }}
              disabled={disable}
            >
              Submit
            </Button>
            <Button
              data-testid="Cancel"
              variant="secondary"
              style={{ margin: "4px" }}
              onClick={() => navigate("/BusHome/Ownerprofile")}
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <EmailVerification
        show={showEmailVerification}
        setShow={setShowEmailVerification}
        values={updateValues}
        afterFunction={UpdateOwner}
        alertMessage={"Updating profile"}
      />
    </>
  );
}
