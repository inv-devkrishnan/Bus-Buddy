import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { axiosApi } from "../../../utils/axiosApi";
import Swal from "sweetalert2";

export default function Viewallroutes() {
  const [pageno, setpageno] = useState(1);
  const [data, setData] = useState([]);
  const navi = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosApi.get(
        `http://localhost:8000/bus-owner/view-routes/`
      );
      setData(response.data);
    };
    fetchData();
  }, [pageno]);

  const next = (event) => {
    event.preventDefault();
    setpageno(pageno + 1);
  };

  const prev = (event) => {
    event.preventDefault();
    pageno > 1 && setpageno(pageno - 1);
  };

  const renderCards = () => {
    return data.map((viewroutes) => (
      <div className="card" key={viewroutes.id}>
        <h2>Route ID: {viewroutes.id}</h2>
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
        <button
          className="btn btn-primary"
          onClick={() => deleted(viewroutes.id)}
        >
          Delete
        </button>
      </div>
    ));
  };
  const deleted = (id) => {
    axiosApi
      .put(`http://127.0.0.1:8000/bus-owner/delete-routes/${id}/`)
      .then((response) => {
        console.log("bus deleted successfuly");
      })
      .catch((error) => {
        if (error.response) {
          console.log("HTTP status code:", error.response.status);
        } else {
          console.error("An error occurred:", error.message);
        }
      });
  };

  return (
    <div>
      <Navbar className="bg-body-tertiary justify-content-between">
      <Form style={{ textAlign: "center", marginLeft: "25%" }}>
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
          justifyContent: "space-between",
          margin: "20px",
        }}
      >
        <button className="btn btn-primary" onClick={prev}>
          prev
        </button>
        <Link to={"/Addroutes"}>
          <button className="btn btn-primary">Add Routes</button>
        </Link>
        <button className="btn btn-primary" onClick={next}>
          next
        </button>
      </div>
    </div>
  );
}
