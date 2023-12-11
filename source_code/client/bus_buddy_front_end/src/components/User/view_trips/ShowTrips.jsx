import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { ExclamationCircle } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { openAxiosApi } from "../../../utils/axiosApi";
import TripCard from "./TripCard";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import CustomPaginator from "../../common/paginator/CustomPaginator";

function ShowTrips(props) {
  const [trips, setTrips] = useState([]); // to store trips list
  const [seatViewOpen, setSeatViewOpen] = useState(null); // to open only one child

  const PAGE_LIMIT = 5; // initial number of page numbers that should be shown in the pagination
  const [totalPages, setTotalPages] = useState(0); // to store total pages
  const [currentPage, setCurrentPage] = useState(1); // to get current page
  const [hasPrevious, setHasPrevious] = useState(false); // to check if current page has previous page
  const [hasNext, setHasNext] = useState(false); // to check if current page has next page
  const [pageEndLimit, setPageEndLimit] = useState(PAGE_LIMIT); // end limit of page numbers to be shown in pagination
  const [pageStartLimit, setPageStartLimit] = useState(1); // start limit of page numbers to be shown in pagination

  const [seatType, setSeatType] = useState(-1); // to filter record's based of seat type (-1 = disable)
  const [busType, setBusType] = useState(-1); // to filter record's based of bus type (-1 = disable)
  const [busAc, setBusAc] = useState(-1); // to filter record's based of ac or not (-1 = disable)
  const [isLoading, setIsLoading] = useState(true);
  const handleTripCardClick = (index) => {
    setSeatViewOpen(index);
  };
  useEffect(() => {
    loadingSwal();
  }, []);

  useEffect(() => {
    getTrips(props, 1, seatType, busType, busAc);
    setPageStartLimit(1);
    setPageEndLimit(PAGE_LIMIT);
  }, [props, seatType, busType, busAc]);
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
        console.log(result.data);
      })
      .catch(function (error) {
        Swal.fire({
          title: "Something went wrong !",
          icon: "error",
          text: getErrorMessage(error?.response?.data?.error_code),
        });
      });
  };
  const clearFilters = () => {
    // function to clear filters
    setBusType(-1);
    setSeatType(-1);
    setBusAc(-1);
  };
  const viewPage = (page) => {
    getTrips(props, page, seatType, busType, busAc);
  };

  const loadingSwal = () => {
    let timerInterval;
    Swal.fire({
      title: "Loading...!",
      html: "Fetching trips",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
        setIsLoading(false);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("Loading finished");
      }
    });
  };

  let tripsContent;

  if (trips.length > 0) {
    tripsContent = trips.map((trip, index) => (
      <TripCard
        key={trip.trip}
        data={trip}
        startLocation={props?.startLocation}
        startLocationName={props?.startLocationName}
        endLocation={props?.endLocation}
        endLocationName={props?.endLocationName}
        seatViewOpen={seatViewOpen}
        setSeatViewOpen={setSeatViewOpen}
        isOpen={index === seatViewOpen}
        onClick={() => handleTripCardClick(index)}
      />
    ));
  } else {
    tripsContent = (
      <div className="d-flex mt-5 ms-5">
        <ExclamationCircle color="red" size={96}></ExclamationCircle>
        <div className="ms-3">
          <h2>No Matching Trips Found !!</h2>
          <h6>Try another trip or change filter options</h6>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Container fluid className="mb-5 ms-0 me-0">
        <Row>
          <Col md={6} lg={3}>
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
          <Col md={6} lg={9} className="col-offset-auto">
            {isLoading ? <div></div> : tripsContent}
          </Col>
        </Row>
      </Container>
      <CustomPaginator
        PAGE_LIMIT={PAGE_LIMIT}
        totalPages={totalPages}
        currentPage={currentPage}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        pageStartLimit={pageStartLimit}
        pageEndLimit={pageEndLimit}
        setPageStartLimit={setPageStartLimit}
        setPageEndLimit={setPageEndLimit}
        width={"100%"}
        viewPage={viewPage}
      ></CustomPaginator>
    </div>
  );
}
ShowTrips.propTypes = {
  startLocation: PropTypes.string,
  startLocationName: PropTypes.string,
  endLocation: PropTypes.string,
  endLocationName: PropTypes.string,
};
export default ShowTrips;
