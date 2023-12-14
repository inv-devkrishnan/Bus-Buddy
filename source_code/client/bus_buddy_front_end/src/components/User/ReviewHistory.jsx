import React, { useState, useEffect } from "react";

import Dropdown from "react-bootstrap/Dropdown";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import Badge from "react-bootstrap/Badge";
import ProgressBar from "react-bootstrap/ProgressBar";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormLabel from "react-bootstrap/FormLabel";
import { ExclamationCircle, StarFill } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { Formik, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Rating from "@mui/material/Rating";

import { axiosApi } from "../../utils/axiosApi";
import CustomPaginator from "../common/paginator/CustomPaginator";

export default function ReviewHistory() {
  const [sort, setSort] = useState("");
  const [reviewData, setReviewData] = useState([]);
  const [page, setPage] = useState(1); // for storing page number
  const [next, setNext] = useState(1); // for finding next
  const [previous, setPrevious] = useState(1); // for finding previous
  const [totalPages, setTotalPages] = useState(0); // for finding total number of pages
  const [active, setActive] = useState(1); // for setting current page activate
  const [isLoading, setIsLoading] = useState(true); // for setting progress bar
  const [reviewModal, setReviewModal] = useState(false); // for dealing modal visibility
  const [existingData, setExistingData] = useState([]);
  const [ratingValue, setRatingValue] = useState(0);

  useEffect(() => {
    axiosApi
      .get(`user/review-history/?page=${page}&&ordering=${sort}`)
      .then((res) => {
        setReviewData(res.data.results);
        setNext(res.data.has_next);
        setPrevious(res.data.has_previous);
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
  }, [page, sort]);

  const handlePrevious = () => {
    // for moving to previous page
    setActive(active - 1);
    setPage(page - 1);
  };

  const handleNext = () => {
    // for moving to next page
    setActive(active + 1);
    setPage(page + 1);
  };

  const getBadgeColor = (rate) => {
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
    setReviewModal(true);
    axiosApi
      .get(`user/review-update/?review_id=${id}`)
      .then((res) => {
        setExistingData(res.data);
        setRatingValue(res.data?.rating);
        console.log(res.data.review_body);
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
    console.log(values);
    axiosApi
      .put(`user/review-update/?review_id=${existingData?.id}`, values)
      .then((res) => {
        Swal.fire({
          title: "Success",
          text: "Updated successfully",
          icon: "success",
        });
        setReviewModal(false);
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

  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    // for generating pagination
    items.push(
      <Pagination.Item
        key={number}
        active={number === active}
        onClick={() => {
          setActive(number);
          setPage(number);
        }}
      >
        {number}
      </Pagination.Item>
    );
  }

  const paginationBasic = (
    // pagination with previous and next buttons
    <div>
      <Pagination>
        <Pagination.First
          onClick={() => {
            setActive(1);
            setPage(1);
          }}
        />
        {previous ? (
          <Pagination.Prev onClick={handlePrevious} />
        ) : (
          <Pagination.Prev onClick={handlePrevious} disabled />
        )}
        {items}
        {next ? (
          <Pagination.Next onClick={handleNext} />
        ) : (
          <Pagination.Next onClick={handleNext} disabled />
        )}
        <Pagination.Last
          onClick={() => {
            setActive(totalPages);
            setPage(totalPages);
          }}
        />
      </Pagination>
    </div>
  );

  return (
    <div className="d-flex flex-column p-2 bd-highlight">
      <div className="mb-auto p-2 bd-highlight m-3">
        <h1>My Reviews</h1>
      </div>
      <div className="d-flex m-1 justify-content-end">
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
              Newest to Oldest
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
              {reviewData.map((review) => (
                <Card key={review.id} style={{ width: "80%" }}>
                  <Card.Body>
                    <Card.Title>
                      {review.review_title} &ensp;
                      <Badge bg={getBadgeColor(review.rating)}>
                        {review.rating} &nbsp;
                        <StarFill />
                      </Badge>
                    </Card.Title>
                    <Card.Text>{review.review_body}</Card.Text>
                    <div className="d-flex justify-content-end">
                      <Button
                        variant="primary"
                        onClick={() => {
                          handleEdit(review.id);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
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
        {paginationBasic}
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
                    rows={3}
                    cols={10}
                    name="review_body"
                    id="review_body"
                    placeholder={"Review Body"}
                    maxlength={3000}
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
                    onChange={(newValue) => {
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
