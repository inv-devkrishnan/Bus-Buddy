import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navi = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosApi.get(
        `http://localhost:8000/bus-owner/view-trip/`
      );
      setData(response.data);
      console.log(response.data);
    };
    fetchData();
  }, []);
  console.log(data);
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
        <Link to={"/add-trips"}>
          <button className="btn btn-primary"> + Add Trip</button>
        </Link>
      </div>
    </div>
  );
}
