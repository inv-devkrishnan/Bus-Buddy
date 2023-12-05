import React, { useState, useEffect, useCallback } from "react";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import { ExclamationCircle } from "react-bootstrap-icons";

import { axiosApi } from "../../utils/axiosApi";
import Swal from "sweetalert2";
import { showLoadingAlert } from "../common/loading_alert/LoadingAlert";

export default function UserBookingHistory() {
  const [bookingData, setBookingData] = useState([]); // for storing booking data
  const [pageSize, setPageSize] = useState(1); // for storing page size
  const [currentPage, setCurrentPage] = useState(1); // for finding current page
  const [page, setPage] = useState(1); // for storing page number
  const [status, setStatus] = useState(); // for storing status
  const [next, setNext] = useState(1); // for finding next
  const [previous, setPrevious] = useState(1); // for finding previous
  const [totalPages, setTotalPages] = useState(0); // for finding total number of pages
  const [active, setActive] = useState(1); // for setting current page activate
  const [modalShow, setModalShow] = useState(false); // for dealing modal visibility
  const [modalData, setModalData] = useState(null); // for storing data for modal
  const [confirmModalShow, setConfirmModalShow] = useState(false); // for dealing confirm modal visibility

  const viewBookingHistory = useCallback(async () => {
    try {
      const res = await axiosApi.get(
        `user/booking-history?page=${page}&&status=${status}`
      );

      setBookingData(res.data.results);
      setNext(res.data.has_next);
      setPrevious(res.data.has_previous);
      setTotalPages(res.data.total_pages);
      setCurrentPage(res.data.current_page_number);
      setPageSize(res.data.page_size);
    } catch (err) {
      // Handle errors
      console.error("Error:", err);
    }
  }, [page, status]);

  useEffect(() => {
    // for fetching user's booking history
    viewBookingHistory();
  }, [viewBookingHistory]);

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

  const handleCancel = () => {
    // for cancelling a booking
    showLoadingAlert("Cancelling Booking");
    axiosApi
      .put(`user/cancel-booking/?booking_id=${modalData?.id}`)
      .then((res) => {
        Swal.close();
        viewBookingHistory();
        Swal.fire({
          title: "Success",
          text: "Cancelled Successfully, Refund has been initiated",
          icon: "success",
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
                  setPage(1);
                  setActive(1);
                }}
              >
                Cancelled
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setStatus(0);
                  setPage(1);
                  setActive(1);
                }}
              >
                Pending
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setStatus(1);
                  setPage(1);
                  setActive(1);
                }}
              >
                Completed
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setStatus("");
                  setPage(1);
                  setActive(1);
                }}
              >
                All
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="flex-fill m-2">
          <Table hover responsive="sm">
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
                            setModalData(data);
                          }}
                        >
                          View Details
                        </Button>
                      </th>
                    </tr>
                  ))}
                </>
              ) : (
                <div className="d-flex m-5">
                  <ExclamationCircle color="grey" size={90}></ExclamationCircle>
                  <div className="m-3">
                    <h3>No booking data Found !!</h3>
                  </div>
                </div>
              )}
            </tbody>
          </Table>
        </div>
        <div
          className="align-self-center"
          style={{ position: "fixed", bottom: 0 }}
        >
          {paginationBasic}
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
          <div className="d-flex flex-row justify-content-around">
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
                  {modalData?.status === 0 && (
                    <span style={{ color: "#7CB9E8" }}>Booked</span>
                  )}
                </strong>
              </p>
              <h5 style={{ color: "cornflowerblue" }}>Route Details</h5>
              <p>
                From:{" "}
                <strong>
                  {
                    modalData?.pick_up?.start_stop_location?.location
                      ?.location_name
                  }
                </strong>
              </p>
              <p>
                To:{" "}
                <strong>
                  {
                    modalData?.drop_off?.start_stop_location?.location
                      ?.location_name
                  }
                </strong>
              </p>
              <p>
                Departure Date: <strong>{modalData?.trip?.start_date}</strong>
              </p>
              <p>
                Time:{" "}
                <strong>
                  {modalData?.pick_up?.start_stop_location?.arrival_time}
                </strong>{" "}
                to{" "}
                <strong>
                  {modalData?.drop_off?.start_stop_location?.arrival_time}
                </strong>
              </p>
              <p>
                Pick up point: <strong>{modalData?.pick_up?.bus_stop}</strong>
              </p>
              <p>
                Drop off point: <strong>{modalData?.drop_off?.bus_stop}</strong>
              </p>
            </div>
            <div className="m-2">
              <h5 style={{ color: "cornflowerblue" }}>Bus Details</h5>
              <p>
                Bus Name: <strong>{modalData?.trip?.bus?.bus_name}</strong>
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
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Seat</th>
                  </tr>
                </thead>
                <tbody>
                  {modalData?.booked_seats?.map((passenger) => (
                    <tr key={passenger?.id}>
                      <td>{passenger?.traveller_name}</td>
                      <td>
                        {passenger?.traveller_gender === 1 ? "Male" : "Female"}
                      </td>
                      <td>{passenger?.seat}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              setConfirmModalShow(true);
            }}
            disabled={modalData?.status === 99}
          >
            Cancel Booking
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
    </>
  );
}
