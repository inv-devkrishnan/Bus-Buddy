import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { Formik, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import { openAxiosApi } from "../../utils/axiosApi";
import { showLoadingAlert } from "./loading_alert/LoadingAlert";

export default function EmailVerification(props) {
  const otpRules = /^\d+$/;
  const [showSpinner, setShowSpinner] = useState(false); // for dealing the spinner
  const [otpSend, setOtpSend] = useState(false); // for dealing the verify button visibility
  const [disable, setDisable] = useState(false); // for dealing the otp button disability
  const [textDisable, setTextDisable] = useState(false); // for dealing the otp text box disabiblity
  const [timer, setTimer] = useState(300); // for setting timer
  const [intervalId, setIntervalId] = useState(null); // for setting timer interval

  useEffect(() => {
    setOtpSend(false);
  }, []);

  const handleClose = () => {
    props.setShow(false);
    setOtpSend(false);
  }; //for closing the modal

  const getButtonLabel = () => {
    // for changing otp button's label
    if (disable) {
      return "loading...";
    } else if (otpSend) {
      return "Send OTP Again";
    } else {
      return "Send OTP";
    }
  };

  const sendOtpApi = () => {
    // for sending api call for the otp
    setShowSpinner(true);
    setOtpSend(false);
    setDisable(true);
    openAxiosApi
      .post(`account/generate-otp/`, { email: props?.values?.email })
      .then((res) => {
        setShowSpinner(false);
        setOtpSend(true);
        setDisable(false);
        if (res.status === 200) {
          handleClose();
          Swal.fire(
            "Warning!",
            "Regrettably, the allotted chances for today have been exhausted.Try again tomorrow.",
            "warning"
          );
          setOtpSend(false);
        } else if (res.status === 204) {
          handleClose();
          Swal.fire(
            "Already registered!",
            "The email is already registered",
            "warning"
          );
          setOtpSend(false);
        } else if (res.status === 201) {
          Swal.fire("Success!", "OTP has been send to your email", "success");
          startTimer();
        } else {
          console.log(res);
          setOtpSend(false);
        }
      })
      .catch((err) => {
        setShowSpinner(false);
        setOtpSend(false);
        setDisable(false);
        console.log(err);
        Swal.fire("Oops!", "Something went wrong", "error");
      });
  };

  const startTimer = () => {
    // for starting and ending the timer
    setTimer(300);
    clearInterval(intervalId);

    const newIntervalId = setInterval(() => {
      setTimer((prevValue) => {
        if (prevValue > 0) {
          return prevValue - 1;
        } else {
          clearInterval(newIntervalId);
          return 0;
        }
      });
    }, 1000);

    setIntervalId(newIntervalId);
  };

  const formatTime = () => {
    // for formatting the timer as time
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    setTextDisable(false);
    if (timer > 0) {
      return `Time remaining: ${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
    } else {
      setTextDisable(true);
      return "The time to enter OTP has expired. Please try again.";
    }
  };

  const onSubmit = (values) => {
    // for submitting the values from form(email verify)
    openAxiosApi
      .get(`account/verify-email/?email=${values.email}&otp=${values.otp}`)
      .then((res) => {
        if (res.status === 201) {
          Swal.fire("Success!", "Email verified successfully!", "success");
          showLoadingAlert(props.alertMessage);
          handleClose();
          setTimeout(() => {
            props.afterFunction(props.values); // completes the process
          }, 2000);
          setOtpSend(false);
        } else if (res.status === 200) {
          Swal.fire("Oops!", "Validation error", "error");
          setOtpSend(false);
        } else if (res.status === 205) {
          Swal.fire("Oops!", "Incorrect OTP", "warning");
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        Swal.close();
        console.log(err);
        Swal.fire("Oops!", "Something went wrong", "error");
        setOtpSend(false);
      });
  };

  const validationSchema = yup.object().shape({
    // otp form validation
    otp: yup
      .string()
      .matches(/^\S*$/, "Spaces are not allowed")
      .matches(otpRules, "Invalid OTP")
      .max(6)
      .min(6, "OTP has to be 6 digits")
      .required("OTP is required"),
  });

  return (
    <Modal
      show={props.show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Email Verification</Modal.Title>
      </Modal.Header>
      <Modal.Body className="m-1">
        To finalize this process, kindly verify your email address.
        <Formik
          initialValues={{ otp: "", email: props.values.email }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {(formikProps) => (
            <Form onSubmit={formikProps.handleSubmit} className="m-2">
              <Form.Group className="form-group m-1">
                <Form.Label htmlFor="email">
                  The OTP will be forwarded to the provided email address:
                </Form.Label>
                <Field
                  as={Form.Control}
                  name="email"
                  id="email"
                  placeholder={props.values.email}
                  disabled
                  maxlength={6}
                />
              </Form.Group>

              {showSpinner && (
                <div className="d-flex justify-content-center align-items-center m-3">
                  <Spinner
                    animation="border"
                    role="output"
                    variant="secondary"
                  />
                </div>
              )}

              {otpSend && !textDisable && (
                <Form.Group className="form-group m-1 mt-3">
                  <Form.Label htmlFor="otp">OTP :</Form.Label>

                  <span style={{ fontSize: "12px", color: "grey" }}>
                    <br />
                    You have a total of five chances to resend the OTP.
                  </span>
                  <Field
                    as={Form.Control}
                    name="otp"
                    id="otp"
                    placeholder="Enter OTP"
                    maxlength={6}
                    disabled={textDisable}
                    isInvalid={
                      formikProps.errors.otp && formikProps.touched.otp
                    }
                  />
                  <ErrorMessage
                    component="span"
                    name="otp"
                    style={{ color: "red" }}
                  />
                </Form.Group>
              )}
              {otpSend && (
                <p
                  style={{ color: "red" }}
                  className="d-flex justify-content-center align-items-center m-3"
                >
                  {formatTime()}
                </p>
              )}
              <div className="d-flex justify-content-center align-items-center m-3">
                {otpSend && (
                  <Button
                    variant="success"
                    type="submit"
                    disabled={textDisable}
                    className="m-1"
                  >
                    Verify
                  </Button>
                )}
                <Button
                  data-testid="otpButton"
                  variant={disable ? "primary" : "outline-primary"}
                  onClick={() => {
                    sendOtpApi();
                    if (otpSend) {
                      formikProps.resetForm();
                    }
                  }}
                  disabled={disable}
                >
                  {getButtonLabel()}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
EmailVerification.propTypes = {
  values: PropTypes.object,
  show: PropTypes.bool,
  setShow: PropTypes.func,
  afterFunction: PropTypes.func,
  alertMessage: PropTypes.string,
};
