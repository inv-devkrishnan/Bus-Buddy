import React, { useState, useEffect, useCallback } from "react";

import {
  Button,
  Accordion,
  Modal,
  Dropdown,
  Form,
  InputGroup,
  Image,
} from "react-bootstrap";
import { ExclamationCircle } from "react-bootstrap-icons";
import Swal from "sweetalert2";

import { axiosApi } from "../../utils/axiosApi";
import CustomPaginator from "../common/paginator/CustomPaginator";

export default function ComplaintResponse(props) {
  const [sortQuery, setSortQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [responseData, setResponseData] = useState("");
  const [show, setShow] = useState(false);
  const viewComplaintHistory = useCallback(
    async (page) => {
      // api call for getting all reviews
      await axiosApi
        .get(
          `user/list-complaints/?page=${
            page ?? 1
          }&&ordering=${sortQuery}&&search=${searchQuery}`
        )
        .then((res) => {
          props.setComplaintData(res.data.results);
          props.setCurentPage(res.data.current_page_number);
          props.setTotalPages(res.data.total_pages);
        })
        .catch((err) => {
          console.log(err.response);
          Swal.fire({
            title: "Oops",
            text: "Something went wrong",
            icon: "error",
          });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery, sortQuery]
  );

  useEffect(() => {
    // api call
    viewComplaintHistory();
  }, [viewComplaintHistory]);

  const sortBar = () => {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Sort by date
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setSortQuery("-created_date")}>
            Newest to oldest
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSortQuery("created_date")}>
            Oldest to newest
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSortQuery("")}>
            Clear sorting
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="m-3">
      <div className="d-flex justify-content-end">
        <InputGroup className="mb-3">
          <Form.Control
            maxLength={100}
            placeholder="Enter text"
            name="searchText"
            onChange={handleChange}
          />
          <Button
            variant="outline-primary"
            onClick={() => setSearchQuery(searchText)}
          >
            Search
          </Button>
        </InputGroup>
        &ensp;
        {sortBar()}
      </div>
      <br />
      <Accordion>
        {props.complaintData.length > 0 ? (
          <>
            {props.complaintData.map((data) => (
              <Accordion.Item key={data?.id} eventKey={data?.id}>
                <Accordion.Header>
                  {data?.complaint_title} - ({data?.created_date})
                </Accordion.Header>
                <Accordion.Body className="d-flex flex-column m-1">
                  <div style={{ overflowWrap: "break-word" }}>
                    {data?.complaint_body}
                  </div>
                  <Image src={data?.complaint_image} alt="" width="70%" />

                  <Button
                    variant="link"
                    style={{ textDecoration: "none" }}
                    className="m-2"
                    onClick={() => {
                      setResponseData(data.response);
                      setShow(true);
                    }}
                  >
                    View Response
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </>
        ) : (
          <div className="d-flex justify-content-center align-items-center m-5">
            <ExclamationCircle color="grey" size={90} />
            <div className="m-4">
              {searchQuery.length > 0 ? (
                <h3>No result found!!</h3>
              ) : (
                <h3>You have not registered any complaints yet!!</h3>
              )}
            </div>
          </div>
        )}
      </Accordion>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          className="align-self-center"
          style={{ position: "fixed", bottom: 0 }}
        >
          <CustomPaginator
            totalPages={props.totalPages}
            currentPage={props.curentPage}
            viewPage={viewComplaintHistory}
          />
        </div>
      </div>

      <div>
        <Modal
          show={show}
          onHide={() => setShow(false)}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="p-2"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {responseData.length > 0
                ? "Response from the Complaint Viewer"
                : "No Response Yet"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {responseData.length > 0 ? (
              responseData
            ) : (
              <>
                <ExclamationCircle color="indianred" size={30} /> &ensp; The
                viewer has not provided a response yet!
              </>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
