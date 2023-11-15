import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { axiosApi } from "../../../utils/axiosApi";
import Accordion from "react-bootstrap/Accordion";
import Swal from "sweetalert2";
import { Pagination } from "react-bootstrap";

export default function Viewallroutes() {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(1);
  const [previous, setPrevious] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [active, setActive] = useState(1);
  const navi = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosApi.get(
        `http://localhost:8000/bus-owner/view-routes/?page=${page}`
      );
      setData(response.data.results);
      setNext(response.data.has_next);
      setPrevious(response.data.has_previous);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page_number);
      setPageSize(response.data.page_size);
    };
    fetchData();
  }, [page]);
  console.log(data)

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

  const renderCards = () => {
    return data.map((viewroutes) => (
      <div key={viewroutes.id} style={{ marginBottom: "2.5%",borderBlockColor:"black"}}>        
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h2>Route ID: {viewroutes.id}</h2>
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ display: "flex" }}>
                <div>
                  <p>Start Point: {viewroutes.start_point_name}</p>
                  <p>End Point: {viewroutes.end_point_name}</p>
                  <p>Via: {viewroutes.via}</p>
                </div>
                <div style={{ marginLeft: "10%" }}>
                  <p>Distance: {viewroutes.distance}</p>
                  <p>Duration: {viewroutes.duration}</p>
                  <p>Travel Fare: {viewroutes.travel_fare}</p>
                </div>
              </div>
              <div
                style={{
                  marginBottom: "1%",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <button
                  className="btn btn-danger"
                  onClick={() => deleted(viewroutes.id)}
                >
                  Delete
                </button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    ));
  };
  const deleted = (id) => {
    axiosApi
      .put(`http://127.0.0.1:8000/bus-owner/delete-routes/${id}/`)
      .then((response) => {
        console.log("bus deleted successfuly");
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Route Deleted successfully",
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log("HTTP status code:", error.response.status);
        } else {
          console.error("An error occurred:", error.message);
        }
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error Deleting Route",
        });
      });
  };

  return (
    <div>
      <Navbar className="bg-body-tertiary justify-content-between">
        <Form style={{ textAlign: "center", marginLeft: "25%",marginTop:"1%" }} >
          <h1>Viewall</h1>
        </Form>
        <Form inline>
          <Row>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Search"
                className=" mr-sm-2"
              />
            </Col>
            <Col xs="auto">
              <Button type="submit">Submit</Button>
            </Col>
          </Row>
        </Form>
      </Navbar>
      <div className="card-container">{renderCards()}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px",
          flexDirection: "column",
        }}
      >
        {paginationBasic}
        <Link to={"/Addroutes"}>
          <button className="btn btn-primary">Add Routes</button>
        </Link>
      </div>
    </div>
  );
}

