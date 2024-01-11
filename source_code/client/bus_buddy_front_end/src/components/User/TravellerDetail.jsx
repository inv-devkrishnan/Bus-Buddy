import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardBody,
  CardTitle,
  Form,
  Button,
  Tabs,
  Tab,
} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import SquareIcon from "@mui/icons-material/Square";

import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

import { axiosApi } from "../../utils/axiosApi";
import { useAuthStatus } from "../../utils/hooks/useAuth";
import { getPaymentErrorMessages } from "../../utils/getErrorMessage";
import RefundPolicy from "../common/refund_policy_table/RefundPolicy";
import AvailableCoupons from "./AvailableCoupons";

const TravellerDetail = () => {
  const [selectedSeats, setSelectedSeats] = useState([]); // to store the selected seat data
  const [currentTrip, setCurrentTrip] = useState([]); // to store the current trip details
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0); // to save the total charges
  const navigate = useNavigate();
  const authStatus = useAuthStatus();

  useEffect(() => {
    if (authStatus()) {
      if (localStorage.getItem("user_role") !== "2") {
        // if user is not user redirect to login
        navigate("/login");
      } else {
        // stores data from local storage to use states
        const storedSeats = localStorage.getItem("seat_list");
        setSelectedSeats(storedSeats ? JSON.parse(storedSeats) : []);
        const storedTrip = localStorage.getItem("current_trip");
        setCurrentTrip(storedTrip ? JSON.parse(storedTrip) : []);
        setTotalAmount(parseFloat(localStorage.getItem("total_amount")));
      }
    } else {
      navigate("/login"); // if user not logged in redirect to login
    }
  }, []);

  const validationSchema = Yup.object().shape(
    // validation schema for formik
    selectedSeats.reduce((acc, seat) => {
      acc[seat.id] = Yup.object().shape({
        [`name_${seat.id}`]: Yup.string().required("Name is required"),
        [`dob_${seat.id}`]: Yup.date().required("Date of birth is required"),
        [`gender_${seat.id}`]: Yup.string().required("Select a gender"),
      });
      return acc;
    }, {})
  );

  const onSubmit = async () => {
    // stores data to bookings table and remove data from local storage
    let bookedSeats = [];
    for (let seatId in formik.values) {
      // traveller data in json format
      let traveller = {
        traveller_name: formik.values[seatId]?.[`name_${seatId}`],
        traveller_dob: formik.values[seatId]?.[`dob_${seatId}`],
        traveller_gender: formik.values[seatId]?.[`gender_${seatId}`],
        trip: parseInt(currentTrip.data.trip),
        seat: parseInt(seatId),
      };
      bookedSeats.push(traveller);
    }

    const data = {
      // whole data in json format
      total_amount: totalAmount,
      trip: parseInt(currentTrip.data.trip),
      pick_up: parseInt(localStorage.getItem("pick_up")),
      drop_off: parseInt(localStorage.getItem("drop_off")),
      booked_seats: bookedSeats,
    };
    const amountData = {
      total_cost: totalAmount,
    };
    setIsLoading(true);
    // creates a new payment intent
    await axiosApi
      .post("user/create-payment-intent/", amountData)
      .then((res) => {
        // once payment intent is created navigate to payment page with client secret
        navigate("/payment", {
          state: {
            clientSecret: res.data.client_secret,
            data: data,
            payment: true, // to ensure this page is called with a valid payment
          },
        });
      })
      .catch(function (error) {
        Swal.fire({
          title: "Something went wrong !",
          icon: "error",
          text: getPaymentErrorMessages(error?.response?.data?.error_code),
        });
      });
    setIsLoading(false);
  };

  const formik = useFormik({
    // dynamic formik initialisation
    initialValues: selectedSeats.reduce((acc, seat) => {
      acc[seat.id] = {
        [`name_${seat.id}`]: "",
        [`dob_${seat.id}`]: "",
        [`gender_${seat.id}`]: "",
      };
      return acc;
    }, {}),
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const handleInputChange = (seatId, field, value) => {
    // for saving data dynamically using formik with on change property
    formik.setFieldValue(`${seatId}.${field}`, value);
    formik.handleBlur(`${seatId}.${field}`);
  };

  return (
    <div className="d-flex justify-content-lg-center flex-column flex-lg-row">
      <Card style={{ padding: 10 }} className="m-3 w-75">
        <CardTitle>Traveller Details</CardTitle>
        <CardBody>
          <Form onSubmit={formik.handleSubmit}>
            {selectedSeats.map((data) => {
              const seatId = data.id;

              return (
                <Form.Group
                  key={seatId}
                  className="d-flex flex-column flex-lg-row m-3 p-1"
                  controlId={`form_${seatId}`}
                >
                  <Form.Group className="d-flex align-self-center flex-column m-2">
                    <Form.Text>Seat Number</Form.Text>
                    <Form.Label>{data.seat_number}</Form.Label>
                  </Form.Group>
                  <Form.Group className="m-2">
                    <Form.Label>Traveller name</Form.Label>
                    <Form.Control
                      name={`name_${seatId}`}
                      id={`name_${seatId}`}
                      type="text"
                      placeholder="Enter name"
                      value={formik.values[seatId]?.[`name_${seatId}`] || ""}
                      isInvalid={
                        formik.touched[seatId]?.[`name_${seatId}`] &&
                        formik.errors[seatId]?.[`name_${seatId}`]
                      }
                      onChange={(e) =>
                        handleInputChange(
                          seatId,
                          `name_${seatId}`,
                          e.target.value
                        )
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.touched[seatId]?.[`name_${seatId}`] &&
                        formik.errors[seatId]?.[`name_${seatId}`]}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="m-2">
                    <Form.Label>Date of birth</Form.Label>
                    <Form.Control
                      name={`dob_${seatId}`}
                      id={`dob_${seatId}`}
                      type="date"
                      placeholder="Enter DOB"
                      value={formik.values[seatId]?.[`dob_${seatId}`] || ""}
                      isInvalid={
                        formik.touched[seatId]?.[`dob_${seatId}`] &&
                        formik.errors[seatId]?.[`dob_${seatId}`]
                      }
                      onChange={(e) =>
                        handleInputChange(
                          seatId,
                          `dob_${seatId}`,
                          e.target.value
                        )
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.touched[seatId]?.[`dob_${seatId}`] &&
                        formik.errors[seatId]?.[`dob_${seatId}`]}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="d-flex align-self-center flex-column m-2">
                    <Form.Check
                      name={`gender_${seatId}`}
                      type="radio"
                      label="male"
                      id={`gender_${seatId}`}
                      disabled={data.female_only}
                      checked={
                        formik.values[seatId]?.[`gender_${seatId}`] === 1
                      }
                      onChange={() =>
                        handleInputChange(seatId, `gender_${seatId}`, 1)
                      }
                      isInvalid={
                        formik.touched[seatId]?.[`gender_${seatId}`] &&
                        formik.errors[seatId]?.[`gender_${seatId}`]
                      }
                    />
                    <Form.Check
                      name={`gender_${seatId}`}
                      type="radio"
                      label="female"
                      id={`gender_${seatId}`}
                      disabled={data.male_only}
                      checked={
                        formik.values[seatId]?.[`gender_${seatId}`] === 2
                      }
                      onChange={() =>
                        handleInputChange(seatId, `gender_${seatId}`, 2)
                      }
                      isInvalid={
                        formik.touched[seatId]?.[`gender_${seatId}`] &&
                        formik.errors[seatId]?.[`gender_${seatId}`]
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.touched[seatId]?.[`gender_${seatId}`] &&
                        formik.errors[seatId]?.[`gender_${seatId}`]}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Group>
              );
            })}
            <div className="d-flex justify-content-center">
              <Button type="submit" disabled={isLoading} className="m-1">
                {isLoading ? (
                  <div>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="output"
                      aria-hidden="true"
                    />
                    Loading...
                  </div>
                ) : (
                  "Book Seat"
                )}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>

      <Card style={{ height: "50rem" }} className="m-3 w-75">
        <Tabs defaultActiveKey="trip">
          <Tab eventKey="trip" title="Trip">
            <div style={{ padding: 5, marginTop: 50 }}>
              <Timeline position="alternate">
                <TimelineItem>
                  <TimelineOppositeContent
                    style={{ m: "auto 0" }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                  >
                    <Typography>Starts from</Typography>
                    {currentTrip?.data?.start_location_arrival_time}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot color="error">
                      <CircleIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent style={{ py: "12px", px: 2 }}>
                    <Typography variant="h6" component="span">
                      {currentTrip?.startLocationName}
                    </Typography>
                    <Typography>
                      {currentTrip?.data?.start_location_arrival_date}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineOppositeContent
                    sx={{ m: "auto 0" }}
                    align="right"
                    variant="body2"
                  >
                    <Typography variant="p" component="span">
                      {localStorage.getItem("pick_stop")}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot sx={"sm"} color="error" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ m: "auto 0" }} color="text.secondary">
                    pick up point
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineOppositeContent
                    style={{ m: "auto 0" }}
                    variant="body2"
                  >
                    <Typography variant="h6" component="span">
                      {currentTrip?.endLocationName}
                    </Typography>
                    <Typography>
                      {currentTrip?.data?.end_location_arrival_date}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot color="success">
                      <SquareIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent
                    style={{ py: "12px", px: 2 }}
                    color="text.secondary"
                  >
                    <Typography>Arrives at</Typography>
                    {currentTrip?.data?.end_location_arrival_time}
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineOppositeContent
                    sx={{ m: "auto 0" }}
                    variant="body2"
                    color="text.secondary"
                  >
                    drop off point
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot variant="outlined" sx={"sm"} color="success" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: "12px", px: 2, m: "auto 0" }}>
                    <Typography variant="p" component="span">
                      {localStorage.getItem("drop_stop")}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </div>
          </Tab>

          <Tab eventKey="coupon" title="Coupons and Total amount">
            <AvailableCoupons
              totalAmount={totalAmount}
              setTotalAmount={setTotalAmount}
            />
          </Tab>

          <Tab eventKey="amount" title="Refund Policy">
            <div className="ps-5 pe-5 pt-5 pb-2">
              <RefundPolicy />
            </div>
          </Tab>
        </Tabs>
      </Card>
    </div>
  );
};

export default TravellerDetail;
