import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import { BackspaceFill } from "react-bootstrap-icons";
import ComplaintCard from "./ComplaintCard";
import { axiosApi } from "../../../utils/axiosApi";
import CustomPaginator from "../paginator/CustomPaginator";
import Swal from "sweetalert2";
function ViewComplaints() {
  const sortComplaints = useRef(-1);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const [complaintList, setComplaintList] = useState([]);

  const PAGE_LIMIT = 5; // initial number of page numbers that should be shown in the pagination
  const [totalPages, setTotalPages] = useState(0); // to store total pages
  const [currentPage, setCurrentPage] = useState(1); // to get current page
  const [hasPrevious, setHasPrevious] = useState(false); // to check if current page has previous page
  const [hasNext, setHasNext] = useState(false); // to check if current page has next page
  const [pageEndLimit, setPageEndLimit] = useState(PAGE_LIMIT); // end limit of page numbers to be shown in pagination
  const [pageStartLimit, setPageStartLimit] = useState(1); // start limit of page numbers to be shown in pagination
  let init_date = new Date(0);
  let final_date = new Date(2100, 0, 1);

  const clearDates = () => {
    setFromDate("");
    setToDate("");
    console.log("dates cleared");
    getComplaints();
  };

  const getComplaints = async (url) => {
    let default_url = "adminstrator/view-complaints/";
    if (url) {
      default_url = url;
    }
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
          console.log("Error Occured ");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getComplaintsbyPage = async (page) => {
    if (sortComplaints.current === -1) {
      getComplaints(
        `adminstrator/view-complaints/?page=${page}&from_date=${
          fromDate || "1970-01-01"
        }&to_date=${toDate || "2100-01-01"}`
      );
    } else {
      getComplaints(
        `adminstrator/view-complaints/?page=${page}&from_date=${
          fromDate || "1970-01-01"
        }&to_date=${toDate || "2100-01-01"}&responded=${sortComplaints.current}`
      );
    }
  };
  const checkDates = () => {
    if (fromDate && toDate) {
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
    <Container fluid className="ms-2 mt-2">
      <Row>
        <Col>
          <h1 className="ms-2">View Complaints</h1>
        </Col>
      </Row>
      <Row className=" gx-0">
        <Col lg={3}>
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
                  getComplaintsbyPage(1)
                }}
              >
                Responded Complaints
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  sortComplaints.current = 0;
                  console.log(sortComplaints.current);
                  getComplaintsbyPage(1)
                }}
              >
                Not Responded Complaints
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  sortComplaints.current = -1;
                  console.log(sortComplaints.current);
                    getComplaintsbyPage(1)
                }}
              >
                All
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col lg={"auto"}>
          <p className="mt-2 me-1">View from :</p>
        </Col>
        <Col>
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
        <Col lg={"auto"}>
          <p className="ms-2 me-2 mt-2 ">To</p>
        </Col>
        <Col>
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
        <Col lg={"auto"}>
          <Button
            className="ms-2"
            onClick={() => {
              checkDates();
            }}
          >
            Filter
          </Button>
        </Col>
        <Col>
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
      </Row>
      <Row className="pb-5">
        {complaintList.map((complaint) => (
          <Row key={complaint.id}>
            <Col>
              <ComplaintCard complaint={complaint} />
            </Col>
          </Row>
        ))}
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
