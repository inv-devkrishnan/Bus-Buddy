import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Pagination from "react-bootstrap/Pagination";
import { Card, Form } from "react-bootstrap";
import { ExclamationCircle } from "react-bootstrap-icons";
import { openAxiosApi } from "../../../utils/axiosApi";
import TripCard from "./TripCard";

function ShowTrips(props) {
  const [trips, setTrips] = useState([]); // to store trips list
  const [totalPages, setTotalPages] = useState(0); // to store total pages
  const [currentPage, setCurrentPage] = useState(1); // to get current page
  const [hasPrevious, setHasPrevious] = useState(false); // to check if current page has previous page
  const [hasNext, setHasNext] = useState(false); // to check if current page has next page
  const [seatType, setSeatType] = useState(2);
  const [busType, setBusType] = useState(0);
  const [busAc, setBusAc] = useState(0);
  useEffect(() => {
    getTrips(props, 1, seatType, busType, busAc);
  }, [props, seatType, busType, busAc]);

  const generatePaginator = (pages) => {
    // function to show pages at bottom
    let pageItem = [];
    for (let i = 1; i <= pages; ++i) {
      pageItem.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => {
            getTrips(props, i,seatType, busType, busAc);
          }}
        >
          {i}
        </Pagination.Item>
      );
    }
    return pageItem;
  };
  const getTrips = async (value, page, seatType, busType, busAc) => {
    await openAxiosApi
      .get(
        `user/view-trips/?start=${value?.startLocation}&end=${value?.endLocation}&date=${value.tripDate}&page=${page}&seat-type=${seatType}&bus-type=${busType}&bus-ac=${busAc}`
      )
      .then((result) => {
        setTrips(result.data?.data);
        setTotalPages(result.data?.total_pages);
        setHasNext(result.data?.has_next);
        setHasPrevious(result.data?.has_previous);
        setCurrentPage(result.data?.current_page);
        console.log(result);
      });
  };
  return (
    <div className="">
      <div className="d-flex">
        <Card style={{ width: "20rem" }} className="m-3 p-3">
          <h5 className="text-center mt-2">Filters</h5>

          <Form className="ms-3 mt-3">
            <h6>Bus Seat Type</h6>
            <Form.Check
              type="radio"
              label="Seater"
              value={1}
              onChange={(e) => {
                setSeatType(e.target.value);
              }}
              name="seat-type"
            />
            <Form.Check
              type="radio"
              label="Sleeper"
              value={0}
              onChange={(e) => {
                setSeatType(e.target.value);
              }}
              name="seat-type"
            />
            <Form.Check
              type="radio"
              label="Both"
              value={2}
              onChange={(e) => {
                setSeatType(e.target.value);
              }}
              defaultChecked
              name="seat-type"
            />
          </Form>

          <Form className="ms-3 mt-3">
            <h6>Bus Type</h6>
            <Form.Check
              type="radio"
              label="Low Floor"
              value={0}
              onChange={(e) => {
                setBusType(e.target.value);
              }}
              defaultChecked
              name="bus-type"
            />
            <Form.Check
              type="radio"
              label="Multi-Axle"
              value={1}
              onChange={(e) => {
                setBusType(e.target.value);
              }}
              name="bus-type"
            />
            <Form.Check
              type="radio"
              label="both"
              value={2}
              onChange={(e) => {
                setBusType(e.target.value);
              }}
              name="bus-type"
            />
          </Form>

          <Form className="ms-3 mt-3">
            <h6>Air Conditioning</h6>
            <Form.Check
              type="radio"
              label="Yes"
              value={0}
              onChange={(e) => {
                setBusAc(e.target.value);
              }}
              defaultChecked
              name="ac-type"
            />
            <Form.Check
              type="radio"
              label="No"
              value={1}
              onChange={(e) => {
                setBusAc(e.target.value);
              }}
              name="ac-type"
            />
          </Form>
        </Card>
        <div>
          {trips.length > 0 ? (
            trips.map((trip) => (
              <TripCard
                key={trip.trip}
                data={trip}
                startLocationName={props?.startLocationName}
                endLocationName={props?.endLocationName}
              />
            ))
          ) : (
            <div
              style={{ width: "70vw", height: "50vh" }}
              className="mt-3 d-flex justify-content-center align-items-center"
            >
              <div className="d-flex align-items-center">
                <ExclamationCircle color="red" size={96}></ExclamationCircle>
                <div className="ms-3">
                  <h2>No Matching Trips Found !!</h2>
                  <h6 style={{ textAlign: "center" }}>
                    Try another trip or change filter options
                  </h6>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Pagination
        size="md"
        style={{
          width: "100%",
          position: "fixed",
          bottom: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pagination.First
          onClick={() => {
            // move to first page
            getTrips(props, 1,seatType, busType, busAc);
          }}
        />
        <Pagination.Prev
          // checks if data have previous page then move to previous page
          onClick={() => {
            hasPrevious && getTrips(props, currentPage - 1,seatType, busType, busAc);
          }}
        />
        {
          // shows the page numbers
          generatePaginator(totalPages)
        }
        <Pagination.Next
          // checks if data have next page then move to next page
          onClick={() => {
            hasNext && getTrips(props, currentPage + 1,seatType, busType, busAc);
          }}
        />
        <Pagination.Last
          // move to last  page
          onClick={() => {
            // move to first page
            getTrips(props, totalPages,seatType, busType, busAc);
          }}
        />
      </Pagination>
    </div>
  );
}
ShowTrips.propTypes = {
  startLocationName: PropTypes.string,
  endLocationName: PropTypes.string,
};
export default ShowTrips;
