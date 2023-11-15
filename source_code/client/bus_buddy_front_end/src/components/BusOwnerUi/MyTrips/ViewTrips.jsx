import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pagination } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import { axiosApi } from "../../../utils/axiosApi";
import Swal from "sweetalert2";



export default function Viewallbus() {
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
        `http://localhost:8000/bus-owner/view-trip/?page=${page}`
      );
      setData(response.data);
      setNext(response.data.has_next);
      setPrevious(response.data.has_previous);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page_number);
      setPageSize(response.data.page_size);
      console.log(response.data);
    };
    fetchData();
  }, [page]);
  console.log(data);

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
    return data.map((trip) => (
      <div key={trip.id} style={{ marginBottom: "2.5%",borderBlockColor:"black"}}>
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h5>Name : {trip.start_point_name}-{trip.end_point_name}</h5>
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ display: "flex" }}>
                <div>
                <p>trip ID : {trip.id}</p>
                <p>bus Id : {trip.bus}</p>
                <p>route ID : {trip.route}</p>
                <p>Start Date : {trip.start_date}</p>
                <p>Stop Date : {trip.end_date}</p>
                </div>
                <div style={{ marginLeft: "10%" }}>
                <p>

                </p>   
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
                  className="btn btn-primary"
                  // onClick={() => update(trip.id)}
                >
                  Update
                </button>
                {/* <button className="btn btn-primary" onClick={""}>
                  Add seat details
                </button> */}
                <button
                  className="btn btn-danger"
                  onClick={() => deleted(trip.id)}
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


  // const update = (id) => {
  //   navi("/UpdateBus", { state: `${id}` });
  // };
  const deleted = (id) => {
    axiosApi
      .put(`http://127.0.0.1:8000/bus-owner/delete-trip/${id}/`)
      .then((response) => {
        console.log("bus deleted successfuly");

        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Bus Deleted successfully",
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
          text: "Error Deleting Bus",
        });
      });
  };

  return (
    <div>
      <Navbar className="bg-body-tertiary justify-content-between">
      <Form style={{ textAlign: "center", marginLeft: "25%",marginTop:"1%" }}>
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
        }}
      >
        {paginationBasic}
        <Link to={"/add-trips"}>
          <button className="btn btn-primary"> + Add Trip</button>
        </Link>
      </div>
    </div>
  );
}
