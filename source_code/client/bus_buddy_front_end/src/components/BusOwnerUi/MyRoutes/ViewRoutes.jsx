import React, { useEffect, useState } from "react";
import { Link,} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import { axiosApi } from "../../../utils/axiosApi";
import Accordion from "react-bootstrap/Accordion";
import Swal from "sweetalert2";
import { Pagination } from "react-bootstrap";

export default function Viewallroutes() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(1);
  const [previous, setPrevious] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [active, setActive] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosApi.get(
        `http://localhost:8000/bus-owner/view-routes/?page=${page}`
      );
      setData(response.data.results);
      setNext(response.data.has_next);
      setPrevious(response.data.has_previous);
      setTotalPages(response.data.total_pages);
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
          <Accordion.Item eventKey="1" data-testid = "accordian-button">
            <Accordion.Header>
              <h4>Route : {viewroutes.start_point_name} to {viewroutes.end_point_name}</h4>
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
                  data-testid = "delete-button"
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
      <Navbar className="bg-body-tertiary d-flex justify-content-between align-items-center">
      <h1 className="mx-auto">Viewall</h1>
      <Form style={{ textAlign: "center" }}>
      <Link to={"/Addroutes"}>
          <button className="btn btn-primary">Add Routes</button>
        </Link>
      </Form>
    </Navbar>
      <div className="card-container">{renderCards()}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px",
          alignItems:"center",
          flexDirection:"column"
        }}
      >
        {paginationBasic}
      </div>
    </div>
  );
}

