import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import { ExclamationCircle } from "react-bootstrap-icons";
import ComplaintCard from "./ComplaintCard";
import { axiosApi } from "../../../utils/axiosApi";
import CustomPaginator from "../paginator/CustomPaginator";
import Swal from "sweetalert2";
import { Form, Modal, ProgressBar } from "react-bootstrap";
import "./viewComplaint.css";
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

  const [totalPages, setTotalPages] = useState(0); // to store total pages
  const [currentPage, setCurrentPage] = useState(1); // to get current page
  const [hasPrevious, setHasPrevious] = useState(false); // to check if current page has previous page

  const [showFilter, setShowFilter] = useState(false);

  const handleFilterClose = () => setShowFilter(false); // hides filter by dates dialog
  const handleFilterShow = () => setShowFilter(true); // shows filter by dates dialog

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
          setHasPrevious(Boolean(result?.data?.has_previous));
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
      if (fromSelectedDate.current <= toSelectedDate.current) {
        getComplaintsbyPage(1);
      } else {
        Swal.fire({
          title: "from date should be before or same as to date",
          icon: "error",
        });
      }
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
        <Col xxl={3} xl={3} lg={4} md={4} sm={4} xs={12}>
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

        <Col xxl={9} xl={9} lg={8} md={8} sm={8} xs={12} className="search_box">
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
      <Row className="mt-2">
        <Col
          xxl={12}
          xl={12}
          lg={12}
          className="d-flex justify-content-start mb-1"
        >
          <Button
            className="ms-2"
            data-testid="Filter by Date"
            onClick={() => {
              handleFilterShow();
            }}
            data-toggle="tooltip"
            title="Filter by Dates"
            size="sm"
          >
            {fromSelectedDate.current ? (
              <div>
              Filter from : {fromSelectedDate.current} - {toSelectedDate.current}
              </div>
            ) : (
              "Filter by Date"
            )}
          </Button>
        </Col>
      </Row>
      {searchMode && (
        <Row className="mt-2">
          <Col>
            <h2>Search result for "{searchbox.value}"</h2>
          </Col>
        </Row>
      )}
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
        <Col className="d-flex justify-content-center">
          {!complaintListLoading && (
            <CustomPaginator
              totalPages={totalPages}
              currentPage={currentPage}
              viewPage={getComplaintsbyPage}
            ></CustomPaginator>
          )}
        </Col>
      </Row>
      <Modal show={showFilter} onHide={handleFilterClose}>
        <Modal.Header closeButton>
          <Modal.Title>Filter by Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p className="mt-2 me-1">View from :</p>
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
            <p className="ms-2 me-2 mt-2 ">To</p>
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              clearDates();
              handleFilterClose();
            }}
          >
            Clear Filter
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              checkDates();
              handleFilterClose();
            }}
          >
            Filter
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
export default ViewComplaints;
