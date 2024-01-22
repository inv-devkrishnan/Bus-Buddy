import React, { useState, useEffect } from "react";

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

import { axiosApi } from "../../utils/axiosApi";

export default function ComplaintResponse() {
  const [complaintData, setComplaintData] = useState([]);
  const [sortQuery, setSortQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [responseData, setResponseData] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    axiosApi
      .get(`user/list-complaints/?ordering=${sortQuery}&&search=${searchQuery}`)
      .then((res) => {
        setComplaintData(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [searchQuery, sortQuery]);

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
            maxLength={50}
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
        {complaintData.length > 0 ? (
          <>
            {complaintData.map((data) => (
              <Accordion.Item key={data?.id} eventKey={data?.id}>
                <Accordion.Header>
                  {data?.complaint_title} - ({data?.created_date})
                </Accordion.Header>
                <Accordion.Body className="d-flex flex-column m-1">
                  {data?.complaint_body}
                  <Image src={data?.complaint_image} alt="" width={500} />

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
          <div className="d-flex m-5">
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
  );
}
