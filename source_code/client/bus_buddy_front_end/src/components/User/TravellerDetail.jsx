import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardBody,
  CardTitle,
  Form,
  Button,
  CardText,
} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { ArrowRight } from "react-bootstrap-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

import { axiosApi } from "../../utils/axiosApi";
import { useAuthStatus } from "../../utils/hooks/useAuth";
import { getErrorMessage } from "../../utils/getErrorMessage";

const TravellerDetail = () => {
  const [selectedSeats, setSelectedSeats] = useState([]); // to store the selected seat data
  const [currentTrip, setCurrentTrip] = useState([]); // to store the current trip details
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const authStatus = useAuthStatus();

  useEffect(() => {
    if (authStatus) {
      if (localStorage.getItem("user_role") !== "2") {
        // if user is not user redirect to login
        navigate("/login");
      }
    } else {
      navigate("/login"); // if user not logged in redirect to login
    }
    // stores data from local storage to use states
    const storedSeats = localStorage.getItem("seat_list");
    setSelectedSeats(storedSeats ? JSON.parse(storedSeats) : []);
    const storedTrip = localStorage.getItem("current_trip");
    setCurrentTrip(storedTrip ? JSON.parse(storedTrip) : []);
  }, [navigate,]);

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
      total_amount: parseInt(localStorage.getItem("total_amount")),
      trip: parseInt(currentTrip.data.trip),
      pick_up: parseInt(localStorage.getItem("pick_up")),
      drop_off: parseInt(localStorage.getItem("drop_off")),
      booked_seats: bookedSeats,
    };
    const amountData = {
      total_cost: parseInt(localStorage.getItem("total_amount")),
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
          text: getErrorMessage(error?.response?.data?.error_code),
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
        [`gender_${seat.id}`]: 1,
      };
      return acc;
    }, {}),
    validationSchema,
    onSubmit,
  });

  const handleInputChange = (seatId, field, value) => {
    // for saving data dynamically using formik eith on change property
    formik.setFieldValue(`${seatId}.${field}`, value);
    formik.handleBlur(`${seatId}.${field}`);
  };

  return (
    <div className="d-flex align-items-center justify-conyent-center flex-column m-2">
      <Card style={{ width: "75%", padding: 5 }}>
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
                      isInvalid={formik.errors[seatId]?.[`name_${seatId}`]}
                      onChange={(e) =>
                        handleInputChange(
                          seatId,
                          `name_${seatId}`,
                          e.target.value
                        )
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors[seatId]?.[`name_${seatId}`]}
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
                      isInvalid={formik.errors[seatId]?.[`dob_${seatId}`]}
                      onChange={(e) =>
                        handleInputChange(
                          seatId,
                          `dob_${seatId}`,
                          e.target.value
                        )
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors[seatId]?.[`dob_${seatId}`]}
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
                      isInvalid={formik.errors[seatId]?.[`gender_${seatId}`]}
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
                      isInvalid={formik.errors[seatId]?.[`gender_${seatId}`]}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors[seatId]?.[`gender_${seatId}`]}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Group>
              );
            })}
            <Button type="submit" disabled={isLoading}>
              {" "}
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
          </Form>
        </CardBody>
      </Card>

      <Card style={{ width: "75%", padding: 5 }}>
        <CardTitle>Trip Details</CardTitle>
        <CardBody>
          <div className="d-flex justify-content-around">
            <CardText>
              <strong>{currentTrip?.startLocationName}</strong>
              <br />
              {currentTrip?.data?.start_location_arrival_date}
              <br />
              {currentTrip?.data?.start_location_arrival_time}
            </CardText>
            <CardText>
              <br />
              <ArrowRight />
            </CardText>
            <CardText>
              <strong>{currentTrip?.endLocationName}</strong>
              <br />
              {currentTrip?.data?.end_location_arrival_date}
              <br />
              {currentTrip?.data?.end_location_arrival_time}
            </CardText>
          </div>
        </CardBody>
      </Card>

      <Card style={{ width: "75%", padding: 5 }}>
        <CardTitle>Payment Details</CardTitle>
        <CardBody>
          <CardText style={{ margin: 5 }}>
            <h6>Total Amount:</h6>
            {localStorage.getItem("total_amount")}
          </CardText>
        </CardBody>
      </Card>
    </div>
  );
};

export default TravellerDetail;
