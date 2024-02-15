import React, { useState, useEffect, useCallback } from "react";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import ProgressBar from "react-bootstrap/ProgressBar";
import Form from "react-bootstrap/Form";
import FormLabel from "react-bootstrap/FormLabel";
import { ExclamationCircle } from "react-bootstrap-icons";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { axiosApi } from "../../utils/axiosApi";
import Swal from "sweetalert2";
import { showLoadingAlert } from "../common/loading_alert/LoadingAlert";
import Rating from "@mui/material/Rating";
import RefundPolicy from "../common/refund_policy_table/RefundPolicy";
import CustomPaginator from "../common/paginator/CustomPaginator";
import truncateText from "../../utils/truncateText";
import { Typography } from "@mui/material";

export default function UserBookingHistory() {
  const [bookingData, setBookingData] = useState([]); // for storing booking data
  const [pageSize, setPageSize] = useState(1); // for storing page size
  const [currentPage, setCurrentPage] = useState(1); // for finding current page
  const [status, setStatus] = useState(); // for storing status
  const [totalPages, setTotalPages] = useState(0); // for finding total number of pages
  const [modalShow, setModalShow] = useState(false); // for dealing modal visibility
  const [modalData, setModalData] = useState(null); // for storing data for modal
  const [confirmModalShow, setConfirmModalShow] = useState(false); // for dealing confirm modal visibility
  const [isLoading, setIsLoading] = useState(true); // for setting progress bar
  const [reviewModal, setReviewModal] = useState(false); // for dealing modal visibility
  const [ratingValue, setRatingValue] = useState(0); // to store value of rating
  const [policyModalShow, setPolicyModalShow] = useState(false); // to handle policy modal

  const viewBookingHistory = useCallback(
    async (page) => {
      try {
        if (page) {
          const res = await axiosApi.get(
            `user/booking-history?page=${page}&&status=${status}`
          );
          setBookingData(res.data.results);
          setTotalPages(res.data.total_pages);
          setCurrentPage(res.data.current_page_number);
          setPageSize(res.data.page_size);
        } else {
          const res = await axiosApi.get(
            `user/booking-history?page=${1}&&status=${status}`
          );

          setBookingData(res.data.results);
          setTotalPages(res.data.total_pages);
          setCurrentPage(res.data.current_page_number);
          setPageSize(res.data.page_size);
        }
      } catch (err) {
        // Handle errors
        console.error("Error:", err);
      }
      setIsLoading(false);
    },
    [status]
  );

  useEffect(() => {
    // for fetching user's booking history
    viewBookingHistory();
  }, [viewBookingHistory]);

  const handlePolicyClose = () => setPolicyModalShow(false);
  const handlePolicyShow = () => setPolicyModalShow(true);

  const handleCancel = () => {
    // for cancelling a booking
    showLoadingAlert("Cancelling Booking");
    axiosApi
      .put(`user/cancel-booking/?booking_id=${modalData?.id}`)
      .then((res) => {
        Swal.close();
        viewBookingHistory();
        let message;
        let title;
        let icon;
        switch (res.data?.code) {
          case "D2007":
            message = "Cancelled Successfully, Full Refund has been initiated";
            title = "Success";
            icon = "success";
            break;
          case "D2008":
            message = "Cancelled Successfully";
            title = "Success";
            icon = "success";
            break;
          case "D2009":
            message =
              "Cancelled Successfully, partial Refund has been initiated";
            title = "Success";
            icon = "success";
            break;
          default:
            icon = "error";
            title = "Cancellation Failed";
            message = "Something went wrong,please try again";
        }
        Swal.fire({
          title: title,
          text: message,
          icon: icon,
        });
        setConfirmModalShow(false);
        setModalShow(false);
      })
      .catch((err) => {
        Swal.fire({
          title: "Oops",
          text: "Something went wrong",
          icon: "error",
        });
      });
  };

  const getStatusColor = (data) => {
    // for colours in table
    if (data?.status === 99) {
      return "tomato";
    } else if (data?.status === 1) {
      return "yellowgreen";
    } else {
      return "cornflowerblue";
    }
  };

  const validationSchema = yup.object().shape({
    // review form validation
    review_title: yup.string().trim().required("Review Title is required"),
    review_body: yup.string().trim().required("Description is required"),
    rating: yup
      .number()
      .integer("Rating must be an integer")
      .min(0, "Rating must be at least 0")
      .max(5, "Rating must be at most 5")
      .required("Rating is required"),
  });

  const onSubmit = (values) => {
    // review form submission
    showLoadingAlert("Submitting review");
    axiosApi
      .post(`user/review-trip/?booking_id=${modalData?.id}`, values)
      .then((res) => {
        console.log(res);
        Swal.fire({
          title: "Success",
          text: "Review submitted successfully",
          icon: "success",
        });

        setReviewModal(false);
        setModalShow(false);
        viewBookingHistory();
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: "Oops!",
          text: "Something went wrong",
          icon: "error",
        });

        setReviewModal(false);
        setModalShow(false);
        viewBookingHistory();
      });
  };

  const withTooltip = (
    WrappedComponent,
    tooltipText,
    truncateLength,
    componentProps
  ) => {
    return (
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id="tooltip">{tooltipText}</Tooltip>}
      >
        <WrappedComponent {...componentProps}>
          {truncateText(tooltipText, truncateLength)}
        </WrappedComponent>
      </OverlayTrigger>
    );
  };

  return (
    <>
      <div className="d-flex flex-column p-2 bd-highlight">
        <div className="mb-auto p-2 bd-highlight m-3">
          <h1>My Trips</h1>
        </div>
        <div className="d-flex m-1 justify-content-end">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic">Show</Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  setStatus(99);
                }}
              >
                Cancelled
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setStatus(0);
                }}
              >
                Booked
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setStatus(1);
                }}
              >
                Completed
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setStatus("");
                }}
              >
                All
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="flex-fill m-2">
          <Table hover responsive="lg">
            <thead style={{ color: "blueviolet" }}>
              <tr>
                <th>SI No.</th>
                <th>Booking Id</th>
                <th>From</th>
                <th>To</th>
                <th>Departure time</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <div className="w-50 ms-auto me-auto mt-5">
                      <ProgressBar animated now={100} />
                    </div>
                    <p className="ms-3 mt-3 text-center">
                      Loading bookings. Please Wait...
                    </p>
                  </td>
                </tr>
              ) : (
                <>
                  {bookingData.length !== 0 ? (
                    <>
                      {bookingData.map((data, key) => (
                        <tr key={data?.id}>
                          <th>{key + (currentPage - 1) * pageSize + 1}</th>
                          <th
                            style={{
                              color: getStatusColor(data),
                            }}
                          >
                            {data?.booking_id}
                          </th>
                          <th>
                            {
                              data?.pick_up?.start_stop_location?.location
                                ?.location_name
                            }
                          </th>
                          <th>
                            {
                              data?.drop_off?.start_stop_location?.location
                                ?.location_name
                            }
                          </th>
                          <th>
                            {data?.trip?.start_date}
                            <br />
                            {data?.trip?.start_time}
                          </th>
                          <th>
                            <Button
                              onClick={() => {
                                setModalShow(true);
                                setModalData({ ...data });
                              }}
                            >
                              View Details
                            </Button>
                          </th>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <div className="d-flex justify-content-center align-items-center m-5">
                          <ExclamationCircle color="grey" size={90} />
                          <div className="m-3">
                            <h3>No booking data Found !!</h3>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </Table>
        </div>
        <div
          className="align-self-center"
          style={{ position: "fixed", bottom: 0 }}
        >
          <CustomPaginator
            totalPages={totalPages}
            currentPage={currentPage}
            viewPage={viewBookingHistory}
          />
        </div>
      </div>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <strong>{modalData?.booking_id}</strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column flex-lg-row justify-content-around">
            <div className="m-2">
              <p>
                Booking date:{" "}
                <strong>
                  {new Date(modalData?.created_date).toLocaleDateString()}
                </strong>
              </p>
              <p>
                Booking status:{" "}
                <strong>
                  {modalData?.status === 99 && (
                    <span style={{ color: "tomato" }}>Cancelled</span>
                  )}
                  {modalData?.status === 1 && (
                    <>
                      <span style={{ color: "yellowgreen	" }}>Invalid</span>
                      <br />
                      <span style={{ color: "silver	" }}>
                        Trip has been completed.
                        <br />
                        Hence this ticket is invalid.
                      </span>
                    </>
                  )}
                  {modalData?.status === 0 && (
                    <span style={{ color: "#7CB9E8" }}>Booked</span>
                  )}
                </strong>
              </p>
              <h5 style={{ color: "cornflowerblue" }}>Route Details</h5>
              <p>
                From:{" "}
                {withTooltip(
                  Typography,
                  modalData?.pick_up?.start_stop_location?.location
                    ?.location_name,
                  10,
                  { style: { fontWeight: "bold" }, component: "span" }
                )}
              </p>
              <p>
                To:{" "}
                {withTooltip(
                  Typography,
                  modalData?.drop_off?.start_stop_location?.location
                    ?.location_name,
                  10,
                  { style: { fontWeight: "bold" }, component: "span" }
                )}
              </p>
              <p>
                Departure Date:{" "}
                <strong>
                  {new Date(
                    new Date(modalData?.trip?.start_date).getTime() +
                      modalData?.pick_up?.start_stop_location
                        ?.arrival_date_offset *
                        24 *
                        60 *
                        60 *
                        1000
                  ).toDateString()}
                </strong>
              </p>
              <p>
                Pick up point:{" "}
                {withTooltip(Typography, modalData?.pick_up?.bus_stop, 10, {
                  style: { fontWeight: "bold" },
                  component: "span",
                })}
                <br />
                Pick up time:{" "}
                <strong>
                  {modalData?.pick_up?.start_stop_location?.arrival_time}
                </strong>
              </p>
              <p>
                Drop off point:{" "}
                {withTooltip(Typography, modalData?.drop_off?.bus_stop, 10, {
                  style: { fontWeight: "bold" },
                  component: "span",
                })}
                <br />
                Drop off time:{" "}
                <strong>
                  {modalData?.drop_off?.start_stop_location?.arrival_time}
                </strong>
              </p>
            </div>
            <div className="m-2">
              <h5 style={{ color: "cornflowerblue" }}>Bus Details</h5>
              <p>
                Bus Name:{" "}
                {withTooltip(Typography, modalData?.trip?.bus?.bus_name, 10, {
                  style: { fontWeight: "bold" },
                  component: "span",
                })}
              </p>
              <p>
                Bus Plate Number:{" "}
                <strong>{modalData?.trip?.bus?.plate_no}</strong>
              </p>
              <h5 style={{ color: "cornflowerblue" }}>Payment Details</h5>
              <p>
                Total amount: <strong>{modalData?.total_amount}</strong>
              </p>
              <h5 style={{ color: "cornflowerblue" }}>Passenger Details</h5>
              <Table responsive="md">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Seat</th>
                    <th>Type</th>
                    <th>Deck</th>
                  </tr>
                </thead>
                <tbody>
                  {modalData?.booked_seats?.map((passenger) => (
                    <tr key={passenger?.id}>
                      <td>
                        {withTooltip(
                          Typography,
                          passenger?.traveller_name,
                          10,
                          {
                            style: { fontWeight: "bold" },
                            component: "span",
                          }
                        )}
                      </td>
                      <td>
                        {passenger?.traveller_gender === 1 ? "Male" : "Female"}
                      </td>
                      <td>{passenger?.seat.seat_number}</td>
                      <td>
                        {passenger?.seat.seat_type === 0 ? "Seater" : "Sleeper"}
                      </td>
                      <td>{passenger?.seat.deck === 0 ? "Lower" : "Upper"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {modalData?.status === 1 ? (
            <Button
              variant="primary"
              onClick={() => {
                setReviewModal(true);
                setRatingValue(0);
              }}
              disabled={modalData?.review.length !== 0}
            >
              {modalData?.review.length !== 0 ? "Reviewed" : "Review"}
            </Button>
          ) : (
            <Button
              variant="danger"
              onClick={() => {
                setConfirmModalShow(true);
              }}
              disabled={modalData?.status !== 0}
            >
              {modalData?.status === 99 ? "Cancelled" : "Cancel Booking"}
            </Button>
          )}
          <Button
            onClick={() => {
              handlePolicyShow();
            }}
          >
            View Refund Policy
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={confirmModalShow}
        onHide={() => setConfirmModalShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <Modal.Title id="confirm-modal-title-vcenter">
            Cancel the booking
          </Modal.Title>
          Are you sure you want to cancel this booking?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setConfirmModalShow(false);
            }}
          >
            Close
          </Button>

          <Button variant="danger" onClick={handleCancel}>
            Confirm Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={reviewModal}
        onHide={() => setReviewModal(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="p-2"
      >
        <Modal.Header closeButton>
          <Modal.Title>Share Your Reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ review_title: "", review_body: "", rating: 0 }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formikProps) => (
              <Form onSubmit={formikProps.handleSubmit} className="m-2">
                <Form.Group className="form-group m-1">
                  <FormLabel htmlFor="review_title">Title:</FormLabel>
                  <Field
                    as={Form.Control}
                    name="review_title"
                    id="review_title"
                    placeholder="Review Title"
                    maxlength={255}
                    isInvalid={
                      formikProps.errors.review_title &&
                      formikProps.touched.review_title
                    }
                  />
                  <ErrorMessage
                    component="span"
                    name="review_title"
                    style={{ color: "red" }}
                  />
                </Form.Group>
                <Form.Group className="form-group m-1">
                  <FormLabel htmlFor="review_body">Description:</FormLabel>

                  <Form.Control
                    as="textarea"
                    name="review_body"
                    id="review_body"
                    placeholder="Review Body"
                    value={formikProps.values.review_body}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    maxLength={1000}
                    rows={3}
                    cols={10}
                    isInvalid={
                      formikProps.errors.review_body &&
                      formikProps.touched.review_body
                    }
                  />
                  <ErrorMessage
                    component="span"
                    name="review_body"
                    style={{ color: "red" }}
                  />
                </Form.Group>
                <Form.Group className="form-group m-1">
                  <FormLabel htmlFor="review_body">Rating:</FormLabel>
                  <br />
                  <Rating
                    data-testid="rating"
                    name="rating"
                    value={ratingValue}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setRatingValue(newValue);
                        formikProps.setFieldValue("rating", newValue);
                      } else {
                        setRatingValue(0);
                        formikProps.setFieldValue("rating", 0);
                      }
                    }}
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button type="submit">Submit</Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      <Modal show={policyModalShow} onHide={handlePolicyClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Refund Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RefundPolicy />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePolicyClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
