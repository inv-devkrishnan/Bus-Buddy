import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import {
  BackspaceFill,
  ExclamationCircle,
  Filter,
} from "react-bootstrap-icons";
import ComplaintCard from "./ComplaintCard";
import { axiosApi } from "../../../utils/axiosApi";
import CustomPaginator from "../paginator/CustomPaginator";
import Swal from "sweetalert2";
import { Form, ProgressBar } from "react-bootstrap";
function ViewComplaints() {
  let init_date = new Date(0);
  let final_date = new Date(2100, 0, 1);
  const sortComplaints = useRef(-1);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const fromSelectedDate = useRef();
  const toSelectedDate = useRef();

  const [complaintList, setComplaintList] = useState([]);
  const [complaintListLoading, setComplaintListLoading] = useState(false);

  const [searchMode, setSearchMode] = useState(false); // to indicate weather a search operation is ongoing
  const [searchEnabled, setSearchEnabled] = useState(false); // to enable and disable search button

  const PAGE_LIMIT = 5; // initial number of page numbers that should be shown in the pagination
  const [totalPages, setTotalPages] = useState(0); // to store total pages
  const [currentPage, setCurrentPage] = useState(1); // to get current page
  const [hasPrevious, setHasPrevious] = useState(false); // to check if current page has previous page
  const [hasNext, setHasNext] = useState(false); // to check if current page has next page
  const [pageEndLimit, setPageEndLimit] = useState(PAGE_LIMIT); // end limit of page numbers to be shown in pagination
  const [pageStartLimit, setPageStartLimit] = useState(1); // start limit of page numbers to be shown in pagination

  let searchbox = document.getElementById("search_box");
  const clearDates = () => {
    setFromDate("");
    setToDate("");
    toSelectedDate.current = "";
    fromSelectedDate.current = "";
    console.log("dates cleared");
    getComplaints();
  };

  const getComplaints = async (url) => {
    let default_url = "adminstrator/view-complaints/";
    if (url) {
      default_url = url;
    }
    setComplaintListLoading(true);
    await axiosApi
      .get(default_url)
      .then((result) => {
        if (result.data?.complaints) {
          setComplaintList(result.data?.complaints);
          setTotalPages(result?.data?.pages);
          setCurrentPage(result?.data?.current_page);
          setCurrentPage(result?.data?.current_page);
          setHasPrevious(Boolean(result?.data?.has_previous));
          setHasNext(Boolean(result?.data?.has_next));
        } else {
          Swal.fire({
            title: "Operation Failed",
            text: "An Error has been occured",
            icon: "error",
          });
          console.log(result.data?.error_code);
        }
      })
      .catch(function (error) {
        Swal.fire({
          title: "Operation Failed",
          text: "An Error has been occured",
          icon: "error",
        });
        console.log(error);
      });
    setComplaintListLoading(false);
  };

  const getComplaintsbyPage = async (page) => {
    if (searchbox.value) {
      if (sortComplaints.current === -1) {
        getComplaints(
          `adminstrator/view-complaints/?page=${page}&created_date__range=${
            fromSelectedDate.current || "1970-01-01"
          },${toSelectedDate.current || "2100-01-01"}&search=${searchbox.value}`
        );
      } else {
        getComplaints(
          `adminstrator/view-complaints/?page=${page}&created_date__range=${
            fromSelectedDate.current || "1970-01-01"
          },${toSelectedDate.current || "2100-01-01"}&status=${
            sortComplaints.current
          }&search=${searchbox.value}`
        );
      }
    } else if (sortComplaints.current === -1) {
      getComplaints(
        `adminstrator/view-complaints/?page=${page}&created_date__range=${
          fromSelectedDate.current || "1970-01-01"
        },${toSelectedDate.current || "2100-01-01"}`
      );
    } else {
      getComplaints(
        `adminstrator/view-complaints/?page=${page}&created_date__range=${
          fromSelectedDate.current || "1970-01-01"
        },${toSelectedDate.current || "2100-01-01"}&status=${
          sortComplaints.current
        }`
      );
    }
  };
  const checkDates = () => {
    if (fromDate && toDate) {
      fromSelectedDate.current = fromDate;
      toSelectedDate.current = toDate;
      getComplaintsbyPage(1);
    } else {
      Swal.fire({
        title: "Both From date and To date need's to be specified",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    getComplaints();
  }, []);

  return (
    <Container fluid className="ms-2 mt-2" style={{ overflowX: "hidden" }}>
      <Row>
        <Col>
          <h1 className="ms-2">View Complaints</h1>
        </Col>
      </Row>
      <Row className=" gx-0 d-flex">
        <Col xxl={"auto"} xl={"auto"}>
          <Dropdown>
            <Dropdown.Toggle variant="light">
              {/* shows current sorting mode */}
              View : {sortComplaints.current === -1 && "All"}
              {sortComplaints.current === 0 && "Not Responded"}
              {sortComplaints.current === 1 && "Responded"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  sortComplaints.current = 1;
                  console.log(sortComplaints.current);
                  getComplaintsbyPage(1);
                }}
              >
                Responded Complaints
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  sortComplaints.current = 0;
                  console.log(sortComplaints.current);
                  getComplaintsbyPage(1);
                }}
              >
                Not Responded Complaints
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  sortComplaints.current = -1;
                  console.log(sortComplaints.current);
                  getComplaintsbyPage(1);
                }}
              >
                All
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col lg={"auto"} md={"auto"} sm={"auto"}>
          <p className="mt-2 me-1">View from :</p>
        </Col>
        <Col xxl={"auto"} xl={"auto"} lg={"auto"} md={"auto"} sm={"auto"}>
          <input
            className="form-control  mb-1"
            id="trip_date_picker"
            type="date"
            onChange={(e) => {
              setFromDate(e.target.value);
            }}
            placeholder="From date"
            max={toDate || final_date}
            value={fromDate}
          />
        </Col>
        <Col lg={"auto"} md={"auto"} sm={"auto"}>
          <p className="ms-2 me-2 mt-2 ">To</p>
        </Col>
        <Col lg={"auto"} md={"auto"} sm={"auto"}>
          <input
            className="form-control  mb-1"
            id="trip_date_picker"
            type="date"
            onChange={(e) => {
              setToDate(e.target.value);
            }}
            min={fromDate || init_date}
            placeholder="To date"
            value={toDate}
          />
        </Col>
        <Col lg={"auto"} md={"auto"} sm={"auto"}>
          <Button
            className="ms-2"
            onClick={() => {
              checkDates();
            }}
            data-toggle="tooltip"
            title="Filter by Dates"
          >
            <Filter></Filter>
          </Button>
        </Col>
        <Col lg={"auto"} md={"auto"} sm={"auto"}>
          <Button
            className="ms-2"
            variant="danger"
            style={{ maxHeight: "40px" }}
            data-toggle="tooltip"
            title="Clear Results"
            onClick={() => {
              clearDates();
            }}
          >
            <BackspaceFill></BackspaceFill>
          </Button>
        </Col>
        <Col
          xxl={4}
          xl={"auto"}
          lg={"auto"}
          md={"auto"}
          sm={"auto"}
          xs={"auto"}
          className="d-flex justify-content-end"
          style={{ maxHeight: "40px" }}
        >
          <div className="d-flex justify-content-start ">
            <Form.Control
              id="search_box"
              placeholder="Search by complaint title"
              onChange={(e) => {
                e.target.value.length > 0
                  ? setSearchEnabled(true)
                  : setSearchEnabled(false);
              }}
              maxLength={50}
              disabled={searchMode}
              style={{ maxWidth: "250px" }}
            />
            {searchMode ? (
              <Button
                variant="danger"
                className="ms-2 "
                onClick={() => {
                  setSearchMode(false);
                  searchbox.value = "";
                  setSearchEnabled(false);
                  getComplaintsbyPage(1);
                }}
              >
                Clear
              </Button>
            ) : (
              <Button
                variant="primary"
                className="ms-2 "
                disabled={!searchEnabled}
                onClick={() => {
                  if (searchbox.value) {
                    setSearchMode(true);
                    getComplaintsbyPage(1);
                  }
                }}
              >
                Search
              </Button>
            )}
          </div>
        </Col>
      </Row>
      <Row className="pb-5">
        {complaintListLoading ? (
          <div className="mt-5">
            <ProgressBar animated now={100} className="w-25 ms-auto me-auto" />
            <p className="ms-3 mt-3 text-center">Please Wait</p>
          </div>
        ) : (
          <div>
            {complaintList.length > 0 ? (
              complaintList.map((complaint) => (
                <Row key={complaint.id} className="pe-4">
                  <Col xl={12} lg={12} md={12} sm={12} xs={12} className="mt-2">
                    <ComplaintCard
                      complaint={complaint}
                      getComplaintsbyPage={getComplaintsbyPage}
                      currentPage={currentPage}
                      complaintListLenght={complaintList.length}
                      hasPrevious={hasPrevious}
                    />
                  </Col>
                </Row>
              ))
            ) : (
              <div className="mt-5">
                <div className="d-flex justify-content-center">
                  <ExclamationCircle size={36}></ExclamationCircle>
                </div>
                <h3 className="text-center mt-3">List empty !</h3>
              </div>
            )}
          </div>
        )}
      </Row>
      <Row>
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
          viewPage={getComplaintsbyPage}
          width={"70%"}
        ></CustomPaginator>
      </Row>
    </Container>
  );
}
export default ViewComplaints;
