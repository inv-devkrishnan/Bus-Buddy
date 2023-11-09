import React, { useState, useEffect } from "react";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import Modal from "react-bootstrap/Modal";

import { axiosApi } from "../../utils/axiosApi";

export default function UserBookingHistory() {
  const [bookingData, setbookingData] = useState([]);
  const [pageSize, setPageSize] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(1);
  const [previous, setPrevious] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [active, setActive] = useState(1);
  const [modalShow, setModalShow] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    axiosApi
      .get(`user/booking-history?page=${page}`)
      .then((res) => {
        setbookingData(res.data.results);
        setNext(res.data.has_next);
        setPrevious(res.data.has_previous);
        setTotalPages(res.data.total_pages);
        setCurrentPage(res.data.current_page_number);
        setPageSize(res.data.page_size);
      })
      .catch((err) => {});
  }, [page]);

  const handlePrevious = () => {
    setActive(active - 1);
    setPage(page - 1);
  };

  const handleNext = () => {
    setActive(active + 1);
    setPage(page + 1);
  };

  let items = [];
  for (let number = 1; number <= totalPages; number++) {
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
    <>
      <div className="d-flex flex-column p-2 bd-highlight">
        <div className="mb-auto p-2 bd-highlight m-3">
          <h1>My Trips</h1>
        </div>
        <div className="flex-fill m-3">
          <Table >
            <thead>
              <tr>
                <th>SI No.</th>
                <th>Booking Id</th>
                <th>From</th>
                <th>To</th>
                <th>Departure time</th>
                <th>Action</th>
              </tr>
              {bookingData ? (
                <>
                  {bookingData.map((data, key) => (
                    <tr key={data?.id}>
                      <th>{key + (currentPage - 1) * pageSize + 1}</th>
                      <th>{data?.booking_id}</th>
                      <th>{data?.pick_up?.location?.location_name}</th>
                      <th>{data?.drop_off?.location?.location_name}</th>
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
                <span>No data to display</span>
              )}
            </thead>
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
          <h5 style={{ color: "cornflowerblue" }}>Route Details</h5>
          <p>
            From:&nbsp;
            <strong>{modalData?.pick_up?.location?.location_name}</strong>
          </p>
          <p>
            To:&nbsp;
            <strong>{modalData?.drop_off?.location?.location_name}</strong>
          </p>
          <p>
            Departure Date:&nbsp;<strong>{modalData?.trip?.start_date}</strong>
          </p>
          <p>
            Travel Time:&nbsp;
            <strong>{modalData?.trip?.start_time}</strong>&nbsp; to &nbsp;
            <strong>{modalData?.trip?.end_time}</strong>
          </p>
          <p>
            Pick up point:&nbsp;<strong>{modalData?.pick_up?.bus_stop}</strong>
          </p>
          <p>
            Drop off point:&nbsp;
            <strong>{modalData?.drop_off?.bus_stop}</strong>
          </p>

          <h5 style={{ color: "cornflowerblue" }}>Bus Details</h5>
          <p>
            Bus Name:&nbsp;<strong>{modalData?.trip?.bus?.bus_name}</strong>
          </p>

          <h5 style={{ color: "cornflowerblue" }}>Payment Details</h5>
          <p>
            Total amount:&nbsp;<strong>{modalData?.total_amount}</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger">Cancel Booking</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
