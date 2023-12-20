import React, { useState, useEffect } from "react";

import Form from "react-bootstrap/Form";
import FormLabel from "react-bootstrap/FormLabel";
import Button from "react-bootstrap/Button";

import { Formik, Field, ErrorMessage } from "formik";
import * as yup from "yup";

import { axiosApi } from "../../utils/axiosApi";
import { showLoadingAlert } from "../common/loading_alert/LoadingAlert";
import Swal from "sweetalert2";

export default function ComplaintForm() {
  const [visible, setVisible] = useState(false); // for handling select visibility
  const [available, setAvailable] = useState([]); // for storing available options for select
  const [busArray, setBusArray] = useState([]); // for storing bus owner ids
  const photoRules = ["image/jpg", "image/jpeg", "image/png"];

  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    axiosApi
      .get(`user/register-complaint/`)
      .then((res) => {
        setAvailable(res.data);
        let sample = [];
        res.data[1].forEach((element) => {
          sample = [...sample, String(element[0])];
          setBusArray(sample);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const validationSchema = yup.object().shape({
    complaint_title: yup.string().required("Subject is required"),
    complaint_body: yup.string().required("Description is required"),
    complaint_for: yup
      .string()
      .matches(/^\d+$/, "You have to choose an option")
      .required("This is a required field"),
    complaint_image: yup
      .mixed()
      .test("is-valid-type", "Not valid type", (value) =>
        photoRules.includes(value?.type)
      )
      .test(
        "is-valid-size",
        "Maximum allowed size is 25MB",
        (value) => value && value.size <= 26214400
      )
      .notRequired(),
  });

  const onSubmit = (values, actions) => {
    console.log(values);
    showLoadingAlert("Registering complaint");

    const formData = new FormData();
    formData.append("complaint_title", values.complaint_title);
    formData.append("complaint_body", values.complaint_body);
    formData.append("complaint_for", values.complaint_for);
    formData.append("complaint_image", values.complaint_image);

    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    axiosApi
      .post(`user/register-complaint/`, formData, config)
      .then((res) => {
        console.log(res);
        Swal.close();
        actions.resetForm();
        actions.setFieldValue("complaint_body", "");
        setVisible(false);
        Swal.fire({
          title: "Complaint registered successfully",
          text: "Please wait for response. Will be updated in 4-5 business days",
          icon: "success",
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: "Oops...",
          text: "Something went wrong!",
          icon: "error",
        });
      });
  };
  return (
    <div>
      <Formik
        initialValues={{
          complaint_title: "",
          complaint_body: "",
          complaint_for: "",
          complaint_image: [],
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formikProps) => (
          <Form onSubmit={formikProps.handleSubmit} className="m-2 p-5">
            <Form.Group className="form-group m-1">
              <FormLabel htmlFor="complaint_title">Subject:</FormLabel>
              <Field
                as={Form.Control}
                name="complaint_title"
                id="complaint_title"
                placeholder="Subject"
                maxLength={255}
                isInvalid={
                  formikProps.errors.complaint_title &&
                  formikProps.touched.complaint_title
                }
              />

              <ErrorMessage
                component="span"
                name="complaint_title"
                style={{ color: "red" }}
              />
            </Form.Group>{" "}
            <Form.Group className="form-group m-1">
              <FormLabel htmlFor="review_body">Description:</FormLabel>

              <Form.Control
                as="textarea"
                rows={3}
                cols={10}
                name="complaint_body"
                id="complaint_body"
                placeholder="Tell us the details of your issue."
                maxLength={3000}
                isInvalid={
                  formikProps.errors.complaint_body &&
                  formikProps.touched.complaint_body
                }
                value={formikProps.values.complaint_body}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
              />
              <ErrorMessage
                component="span"
                name="complaint_body"
                style={{ color: "red" }}
              />
            </Form.Group>
            <Form.Group className="form-group m-1">
              <FormLabel htmlFor="complaint_for">Complaint to:</FormLabel>
              <div className="d-flex flex-column flex-lg-row">
                <Form.Check
                  type="radio"
                  label="Admin"
                  id="admin_radio"
                  name="complaint_for"
                  className="m-2"
                  value={available[0]}
                  checked={
                    formikProps.values.complaint_for === String(available[0])
                  }
                  onChange={(e) => {
                    formikProps.setFieldValue("complaint_for", e.target.value);
                    setVisible(false);
                  }}
                />
                <Form.Check
                  type="radio"
                  label="Bus"
                  id="bus_radio"
                  name="complaint_for"
                  className="m-2"
                  value={"bus"}
                  checked={
                    formikProps.values.complaint_for === "bus" ||
                    busArray.includes(formikProps.values.complaint_for)
                  }
                  onChange={(e) => {
                    formikProps.setFieldValue("complaint_for", e.target.value);
                    setVisible(true);
                  }}
                />
              </div>
              {visible && (
                <Field as={Form.Select} name="complaint_for" id="complaint_for">
                  <option>Select</option>
                  {available[1].map((data) => (
                    <option key={data[0]} value={String(data[0])}>
                      {data[1]}
                    </option>
                  ))}
                </Field>
              )}
              <ErrorMessage
                component="span"
                name="complaint_for"
                style={{ color: "red" }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Upload image: </Form.Label>
              <Form.Control
                type="file"
                name="complaint_image"
                accept={photoRules}
                onChange={(e) => {
                  formikProps.setFieldValue(
                    "complaint_image",
                    e.currentTarget.files[0]
                  );
                  setVisible(false);
                }}
              />
              <ErrorMessage
                component="span"
                name="complaint_image"
                style={{ color: "red" }}
              />
            </Form.Group>
            <div className="d-flex justify-content-end m-2">
              <Button type="submit" className="m-2">
                Submit
              </Button>
              <Button
                type="reset"
                onClick={() => {
                  formikProps.resetForm();
                  setVisible(false);
                }}
                variant="secondary"
                className="m-2"
              >
                Clear
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
