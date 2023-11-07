import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Pagination from "react-bootstrap/Pagination";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { ExclamationCircle } from "react-bootstrap-icons";
import { openAxiosApi } from "../../../utils/axiosApi";
import TripCard from "./TripCard";

function ShowTrips(props) {
  const [trips, setTrips] = useState([]); // to store trips list
  const [totalPages, setTotalPages] = useState(0); // to store total pages
  const [currentPage, setCurrentPage] = useState(1); // to get current page
  const [hasPrevious, setHasPrevious] = useState(false); // to check if current page has previous page
  const [hasNext, setHasNext] = useState(false); // to check if current page has next page
  const [seatType, setSeatType] = useState(-1); // to filter record's based of seat type (-1 = disable)
  const [busType, setBusType] = useState(-1); // to filter record's based of bus type (-1 = disable)
  const [busAc, setBusAc] = useState(-1); // to filter record's based of ac or not (-1 = disable)
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
            getTrips(props, i, seatType, busType, busAc);
          }}
        >
          {i}
        </Pagination.Item>
      );
    }
    return pageItem;
  };
  const getTrips = async (value, page, seatType, busType, busAc) => {
    // function to get trip details from backend
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
  const clearFilters = () => {
    // function to clear filters
    setBusType(-1);
    setSeatType(-1);
    setBusAc(-1);
  };
  return (
    <div>
      <Container className="mb-5 ms-0 me-0">
        <Row>
          <Col md={3}>
            <Card style={{ width: "20rem" }} className="m-3 p-3">
              <div className="d-flex justify-content-between">
                <h5 className="mt-2">Filters</h5>
                <Button variant="danger" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              <Form className="ms-3 mt-3">
                <h6>Bus Seat Type</h6>
                <Form.Check
                  type="radio"
                  label="Seater"
                  value={1}
                  onChange={(e) => {
                    setSeatType(Number(e.target.value));
                  }}
                  checked={seatType === 1}
                  name="seat-type"
                />
                <Form.Check
                  type="radio"
                  label="Sleeper"
                  value={0}
                  checked={seatType === 0}
                  onChange={(e) => {
                    setSeatType(Number(e.target.value));
                  }}
                  name="seat-type"
                />
                <Form.Check
                  type="radio"
                  label="Both"
                  value={2}
                  checked={seatType === 2}
                  onChange={(e) => {
                    setSeatType(Number(e.target.value));
                  }}
                  name="seat-type"
                />
              </Form>

              <Form className="ms-3 mt-3">
                <h6>Bus Type</h6>
                <Form.Check
                  type="radio"
                  label="Low Floor"
                  value={0}
                  checked={busType === 0}
                  onChange={(e) => {
                    setBusType(Number(e.target.value));
                  }}
                  name="bus-type"
                />
                <Form.Check
                  type="radio"
                  label="Multi-Axle"
                  value={1}
                  checked={busType === 1}
                  onChange={(e) => {
                    setBusType(Number(e.target.value));
                  }}
                  name="bus-type"
                />
                <Form.Check
                  type="radio"
                  label="both"
                  value={2}
                  checked={busType === 2}
                  onChange={(e) => {
                    setBusType(Number(e.target.value));
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
                  checked={busAc === 0}
                  onChange={(e) => {
                    setBusAc(Number(e.target.value));
                  }}
                  name="ac-type"
                />
                <Form.Check
                  type="radio"
                  label="No"
                  value={1}
                  checked={busAc === 1}
                  onChange={(e) => {
                    setBusAc(Number(e.target.value));
                  }}
                  name="ac-type"
                />
              </Form>
            </Card>
          </Col>
          <Col>
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
              <div className="d-flex mt-5 ms-5">
                <ExclamationCircle color="red" size={96}></ExclamationCircle>
                <div className="ms-3">
                  <h2>No Matching Trips Found !!</h2>
                  <h6>Try another trip or change filter options</h6>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
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
            getTrips(props, 1, seatType, busType, busAc);
          }}
        />
        <Pagination.Prev
          // checks if data have previous page then move to previous page
          onClick={() => {
            hasPrevious &&
              getTrips(props, currentPage - 1, seatType, busType, busAc);
          }}
        />
        {
          // shows the page numbers
          generatePaginator(totalPages)
        }
        <Pagination.Next
          // checks if data have next page then move to next page
          onClick={() => {
            hasNext &&
              getTrips(props, currentPage + 1, seatType, busType, busAc);
          }}
        />
        <Pagination.Last
          // move to last  page
          onClick={() => {
            // move to first page
            getTrips(props, totalPages, seatType, busType, busAc);
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
