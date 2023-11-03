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


export default function Viewalltask() {
  const [data, setData] = useState([]);
  const [amenitiesdata, setamenitiesData] = useState([]);

  const navi = useNavigate();

  const busAmenities = async (id) => {
    const response = await axiosApi.get(
      `http://127.0.0.1:8000/bus-owner/view-amenities/${id}/`
    );
    console.log(response.data);
    if (response.status === 200) {
      setamenitiesData(response.data);
    }
  };
  console.log(amenitiesdata);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosApi.get(
        `http://localhost:8000/bus-owner/view-bus/`
      );
      setData(response.data);
      console.log(response.data);
    };
    fetchData();
  }, []);
  console.log(amenitiesdata[0]);

  const renderCards = () => {
    return data.map((viewbus) => (
      <div key={viewbus.id} style={{ marginBottom: "2.5%",borderBlockColor:"black"}}>
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h5>Name : {viewbus.bus_name}</h5>
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ display: "flex" }}>
                <div>
                  <p>Bus ID : {viewbus.id}</p>
                  <p>Plate No : {viewbus.plate_no}</p>
                </div>
                <div style={{ marginLeft: "10%" }}>
                  {viewbus.bus_type === 0 ? (
                    <p>Bus Type : Low Floor</p>
                  ) : viewbus.bus_type === 1 ? (
                    <p>Bus Type : Multi Axle</p>
                  ) : (
                    <p>Bus Type : Multi Axle Low Floor</p>
                  )}

                  {viewbus.bus_ac === 0 ? (
                    <p>Bus A/C : A/C</p>
                  ) : viewbus.bus_ac === 1 ? (
                    <p>Bus A/C : Non A/C</p>
                  ) : (
                    <p>Bus A/C : Unknown</p>
                  )}
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
                  onClick={() => update(viewbus.id)}
                >
                  Update
                </button>
                <button className="btn btn-primary" onClick={""}>
                  Add seat details
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleted(viewbus.id)}
                >
                  Delete
                </button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="0" onClick={() => busAmenities(viewbus.id)}>
            <Accordion.Header>Amenities of {viewbus.bus_name}</Accordion.Header>
            <Accordion.Body>
              {amenitiesdata.length > 0  ? (
                <>
                  <p>Do you want to update the existing amenities?</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => updateAmenities(viewbus.id)}
                  >
                    Update amenities
                  </button>
                </>
              ) : (
                <>
                  <p>
                    There are no Amenities added for this bus. Please add
                    amenities for your bus.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => addAmenities(viewbus.id)}
                  >
                    Add amenities
                  </button>
                </>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    ));
  };

  const addAmenities = (id) => {
    const bus=id;
    console.log("bus")
    console.log(bus)
    navi("/Addamenities", { state: bus });
  };

  const updateAmenities = (id) => {
    navi("/Updateamenities", { state: `${id}` });
  };
  const update = (id) => {
    navi("/UpdateBus", { state: `${id}` });
  };
  const deleted = (id) => {
    axiosApi
      .put(`http://127.0.0.1:8000/bus-owner/delete-bus/${id}/`)
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
        <Form style={{ textAlign: "center", marginLeft: "25%" }} inline>
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
        <Link to={"/AddBus"}>
          <button className="btn btn-primary"> + Add Bus</button>
        </Link>
      </div>
    </div>
  );
}
