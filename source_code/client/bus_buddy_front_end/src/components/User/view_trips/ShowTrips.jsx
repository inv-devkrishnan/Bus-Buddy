import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Pagination from "react-bootstrap/Pagination";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { ExclamationCircle } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { openAxiosApi } from "../../../utils/axiosApi";
import TripCard from "./TripCard";
import { getErrorMessage } from "../../../utils/getErrorMessage";

function ShowTrips(props) {
  const [trips, setTrips] = useState([]); // to store trips list
  const [seatViewOpen, setSeatViewOpen] = useState(false);
  const [openChild, setOpenChild] = useState(null);

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

  useEffect(() => {
    getTrips(props, 1, seatType, busType, busAc);
    setPageStartLimit(1);
    setPageEndLimit(PAGE_LIMIT);
  }, [props, seatType, busType, busAc]);
  console.log(seatViewOpen, "seat");
  const generatePaginator = (pages) => {
    // function to show pages at bottom
    if (pages <= PAGE_LIMIT) {
      // if pages are less than page limit no need to show ellipsis
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
    } else {
      let pageItem = [];
      if (pageStartLimit >= PAGE_LIMIT) {
        /* if pageStartLimit is greater than initial PAGE_LIMIT means previous pages exists
         so show the previous page ellipsis */
        pageItem.push(
          <Pagination.Ellipsis
            onClick={() => {
              decrementPageLimit(pageStartLimit);
              // the last page of the new page list will get automatically selected
              getTrips(props, pageStartLimit - 1, seatType, busType, busAc);
            }}
          ></Pagination.Ellipsis>
        );
      }
      for (let i = pageStartLimit; i <= pageEndLimit; ++i) {
        // page items are shown based start and endlimits
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
      // shows the ellipsis to reveal next set of page numbers

      // if current page list doesn't contain the last page than only show the Ellipsis
      if (!isPageNumberVisible(totalPages)) {
        pageItem.push(
          <Pagination.Ellipsis
            onClick={() => {
              incrementPageLimit(pageEndLimit, pages);
              // the first page of the new page list will get automatically selected
              getTrips(props, pageEndLimit + 1, seatType, busType, busAc);
            }}
          ></Pagination.Ellipsis>
        );
      }

      return pageItem;
    }
  };

  const incrementPageLimit = (previousLimit, totalPages) => {
    // new start limit will be the previous end limit
    setPageStartLimit(pageEndLimit + 1);
    if (previousLimit + PAGE_LIMIT <= totalPages) {
      setPageEndLimit(previousLimit + PAGE_LIMIT);
    } else {
      setPageEndLimit(totalPages);
    }
  };

  const decrementPageLimit = (previousLimit) => {
    setPageEndLimit(previousLimit - 1);
    if (previousLimit - PAGE_LIMIT >= PAGE_LIMIT) {
      setPageStartLimit(previousLimit - PAGE_LIMIT);
    } else {
      setPageStartLimit(1);
    }
  };

  const isPageNumberVisible = (page) => {
    // function to check the given page number is on current page list
    return !!(page >= pageStartLimit && page <= pageEndLimit);
  };

  const viewPreviousPageNumbers = (currentPage) => {
    /*function checks if given page is in the current page number list 
      if not loads previous page number list */
    !isPageNumberVisible(currentPage - 1) &&
      currentPage - 1 > 1 &&
      decrementPageLimit(pageStartLimit);
  };

  const viewNextPageNumbers = (currentPage) => {
    /*function checks if given page is in the current page number list 
      if not loads next page number list */
    !isPageNumberVisible(currentPage + 1) &&
      currentPage + 1 <= totalPages &&
      incrementPageLimit(pageEndLimit, totalPages);
  };
  const viewFirstPageNumbers = () => {
    // function view to view the first page number list
    setPageStartLimit(1);
    setPageEndLimit(PAGE_LIMIT);
  };
  const viewLastPageNumbers = () => {
    // function view to view the last  page number list
    setPageStartLimit(totalPages - PAGE_LIMIT);
    setPageEndLimit(totalPages);
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
            {trips.length > 0 ? (
              trips.map((trip) => (
                <TripCard
                  key={trip.trip}
                  data={trip}
                  startLocationName={props?.startLocationName}
                  endLocationName={props?.endLocationName}
                  seatViewOpen={seatViewOpen}
                  setSeatViewOpen={setSeatViewOpen}
                  openChild={openChild}
                  setOpenChild={setOpenChild}
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
            // set the first section of page numbers
            totalPages >= PAGE_LIMIT && viewFirstPageNumbers();
          }}
        />
        <Pagination.Prev
          // checks if data have previous page then move to previous page
          onClick={() => {
            hasPrevious &&
              getTrips(props, currentPage - 1, seatType, busType, busAc);
            totalPages >= PAGE_LIMIT && viewPreviousPageNumbers(currentPage);
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
            totalPages >= PAGE_LIMIT && viewNextPageNumbers(currentPage);
          }}
        />
        <Pagination.Last
          // move to last  page
          onClick={() => {
            getTrips(props, totalPages, seatType, busType, busAc);
            // set the last section of page numbers
            totalPages >= PAGE_LIMIT && viewLastPageNumbers();
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
