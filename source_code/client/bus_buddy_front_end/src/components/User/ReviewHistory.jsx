import React, { useState, useEffect, useCallback } from "react";

import Dropdown from "react-bootstrap/Dropdown";
import CardGroup from "react-bootstrap/CardGroup";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import ProgressBar from "react-bootstrap/ProgressBar";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormLabel from "react-bootstrap/FormLabel";
import Col from "react-bootstrap/esm/Col";
import { ExclamationCircle, StarFill } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { Formik, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Rating from "@mui/material/Rating";

import { axiosApi } from "../../utils/axiosApi";
import CustomPaginator from "../common/paginator/CustomPaginator";

export default function ReviewHistory() {
  const [sort, setSort] = useState(""); // for storing sort value
  const [reviewData, setReviewData] = useState([]); // for storing data of single review
  const [curentPage, setCurentPage] = useState(0); // for storing current page data
  const [totalPages, setTotalPages] = useState(0); // for finding total number of pages
  const [isLoading, setIsLoading] = useState(true); // for setting progress bar
  const [reviewModal, setReviewModal] = useState(false); // for dealing modal visibility
  const [existingData, setExistingData] = useState([]); // for storing drop down values
  const [ratingValue, setRatingValue] = useState(0); // for storing rating value

  const viewReviewHistory = useCallback(
    async (page) => {
      // api call for getting all reviews
      await axiosApi
        .get(`user/review-history/?page=${page ?? 1}&&ordering=${sort}`)
        .then((res) => {
          setReviewData(res.data.results);
          setCurentPage(res.data.current_page_number);
          setTotalPages(res.data.total_pages);
          setIsLoading(false);
        })
        .catch((err) => {
          Swal.fire({
            title: "Oops",
            text: "Something went wrong",
            icon: "error",
          });
          setIsLoading(false);
        });
    },
    [sort]
  );

  useEffect(() => {
    // api call
    viewReviewHistory();
  }, [viewReviewHistory]);

  const getBadgeColor = (rate) => {
    // for changing the badge color
    switch (rate) {
      case 0:
        return "secondary";
      case 1:
        return "danger";
      case 2:
        return "warning";
      case 3:
        return "info";
      case 4:
        return "primary";
      case 5:
        return "success";
      default:
        return "dark";
    }
  };

  const handleEdit = (id) => {
    // calling modal and api call for getting data
    setReviewModal(true);
    axiosApi
      .get(`user/review-update/?review_id=${id}`)
      .then((res) => {
        setExistingData(res.data);
        setRatingValue(res.data?.rating);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: "Oops",
          text: "Something went wrong",
          icon: "error",
        });
      });
  };

  const validationSchema = yup.object().shape({
    // validation for the form
    review_title: yup.string().required("Review Title is required"),
    review_body: yup.string().required("Description is required"),
    rating: yup
      .number()
      .integer("Rating must be an integer")
      .min(0, "Rating must be at least 0")
      .max(5, "Rating must be at most 5")
      .required("Rating is required"),
  });

  const onSubmit = (values) => {
    // form submission
    axiosApi
      .put(`user/review-update/?review_id=${existingData?.id}`, values)
      .then((res) => {
        Swal.fire({
          title: "Success",
          text: "Updated successfully",
          icon: "success",
        });
        setReviewModal(false);
        viewReviewHistory();
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: "Oops",
          text: "Something went wrong",
          icon: "error",
        });
        setReviewModal(false);
      });
  };

  return (
    <div className="d-flex flex-column p-2 bd-highlight">
      <div className="mb-auto p-2 bd-highlight m-2">
        <h1>My Reviews</h1>
      </div>
      <div className="d-flex m-3 justify-content-start">
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic">Sort by</Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                setSort("review_title");
              }}
            >
              Ascending order
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setSort("-review_title");
              }}
            >
              Descending order
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setSort("");
              }}
            >
              Clear sorting
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {isLoading ? (
        <div className="d-flex flex-column justify-content-center align-items-center mt-5">
          <div className="w-50 ms-auto me-auto">
            <ProgressBar animated now={100} />
          </div>
          <p className="ms-3 mt-3 text-center">
            Loading reviews. Please wait...
          </p>
        </div>
      ) : (
        <>
          {reviewData.length > 0 ? (
            <Container>
              <Col>
                {reviewData.map((review) => (
                  <CardGroup key={review?.id} style={{ margin: 3 }}>
                    <Card style={{ backgroundColor: "aliceblue" }}>
                      <Card.Body>
                        <Card.Title>
                          {review?.booking}
                          <br />
                          {review?.route_start} - {review?.route_end}
                          <Card.Text>
                            {review?.pick_up} - {review?.drop_off}
                          </Card.Text>
                        </Card.Title>

                        <Card.Text>
                          Date:&ensp;
                          {review?.trip_start_date} to {review?.trip_end_date}
                          <br />
                          Time:&ensp;
                          {review?.trip_start_time} - {review?.trip_end_time}
                        </Card.Text>

                        <Card.Text>Bus name: {review?.bus_name}</Card.Text>
                      </Card.Body>
                    </Card>

                    <Card style={{ width: "80%" }}>
                      <Card.Body>
                        <Card.Title>
                          {review?.review_title} &ensp;
                          <Badge bg={getBadgeColor(review?.rating)}>
                            {review?.rating} &nbsp;
                            <StarFill />
                          </Badge>
                        </Card.Title>
                        <Card.Text>{review?.review_body}</Card.Text>
                      </Card.Body>
                      <Card.Footer>
                        Last updated on:&ensp;
                        {new Date(review.updated_time).toLocaleDateString()}
                        <div className="d-flex justify-content-end align-items-start">
                          <Button
                            variant="primary"
                            onClick={() => {
                              handleEdit(review?.id);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </Card.Footer>
                    </Card>
                  </CardGroup>
                ))}
              </Col>
            </Container>
          ) : (
            <div className="d-flex m-5">
              <ExclamationCircle color="grey" size={90} />
              <div className="m-3">
                <h3>You have no reviews yet!!</h3>
              </div>
            </div>
          )}
        </>
      )}

      <div
        className="align-self-center"
        style={{ position: "fixed", bottom: 0 }}
      >
        <CustomPaginator
          totalPages={totalPages}
          currentPage={curentPage}
          viewPage={viewReviewHistory}
        />
      </div>

      <Modal
        show={reviewModal}
        onHide={() => setReviewModal(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="p-2"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit This Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              review_title: existingData?.review_title ?? "",
              review_body: existingData?.review_body ?? "",
              rating: existingData?.rating ?? 0,
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
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
                    maxLength={255}
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
                    rows={3}
                    cols={10}
                    name="review_body"
                    id="review_body"
                    placeholder={"Review Body"}
                    maxLength={3000}
                    isInvalid={
                      formikProps.errors.review_body &&
                      formikProps.touched.review_body
                    }
                    value={formikProps.values.review_body}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
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
                    name="rating"
                    value={ratingValue}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setRatingValue(newValue);
                        formikProps.setFieldValue("rating", newValue);
                      } else {
                        setRatingValue(existingData?.rating);
                        formikProps.setFieldValue(
                          "rating",
                          existingData?.rating
                        );
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
    </div>
  );
}
