import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { axiosApi } from "../../../utils/axiosApi";

export default function Addbus() {
  const [bus_name, setBusName] = useState("");
  const [plate_no, setPlateNo] = useState("");
  const [bus_type, setBusType] = useState("");
  const [bus_seat_type, setBusSeatType] = useState("");
  const [bus_ac, setBusAC] = useState("");
  const navi = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bus_name) {
      alert("Bus name cannot be empty");
      return;
    }
    if (!plate_no || plate_no.length > 10) {
      alert("Plate Number cannot exceed 10, and don’t leave spaces in between");
      return;
    }
    if (bus_type < 0 || bus_type > 2) {
      alert("Bus type can only be 0: Sleeper, 1: Seater, 2: Both");
      return;
    }
    if (bus_ac < 0 || bus_ac > 2) {
      alert("Bus A/C can only be 0: A/C, 1: Non A/C");
      return;
    }

    try {
      const response = await axiosApi.post("http://localhost:8000/bus-owner/add-bus/", {
        bus_name: bus_name,
        plate_no: plate_no,
        bus_type: bus_type,
        bus_ac: bus_ac,
        bus_seat_type: bus_seat_type,
      });

      if (response.status === 200) {
        console.log("Inserted");
        console.log(response);
        const data =  response.data.bus
        console.log(data);
        navi("/Addamenities", { state: data });
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginRight: "5rem",
        paddingTop: "5rem",

      }}
    >
      <Card style={{ width: "35rem", height: "30rem", paddingTop: "3rem",boxShadow: "5px 5px 30px 0 rgba(29, 108, 177, 0.5)" }}>
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>Add Bus</Card.Title>
          <div style={{ display: "flex" }}>
            <Form onSubmit={handleSubmit} style={{ paddingTop: "3rem" }}>
              <Row className="mb-2">
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                  <Form.Label> Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Bus name"
                    onChange={(e) => {
                      setBusName(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                  <Form.Label>Plate Number</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Plate Number"
                    onChange={(e) => {
                      setPlateNo(e.target.value);
                    }}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-5">
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Bus Type</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setBusType(e.target.value)}
                  >
                    <option value="">Select option</option>
                    <option value="0"> Low floor </option>
                    <option value="1"> Multi axel </option>
                    <option value="2"> Both </option>
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Bus Seat Type</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setBusSeatType(e.target.value)}
                    value={bus_seat_type}
                  >
                    <option value="">Select option</option>
                    <option value="0"> Sleeper </option>
                    <option value="1"> Seater </option>
                    <option value="2"> Both </option>
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom04">
                  <Form.Label>Bus A/C</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setBusAC(e.target.value)}
                    value={bus_ac}
                  >
                    <option value="">Select option</option>
                    <option value="0"> A/C </option>
                    <option value="1"> Non A/C </option>
                  </Form.Control>
                </Form.Group>
              </Row>
              <div style={{ paddingTop: "1.5rem",display: "flex", justifyContent: "center" }}>
                <Button type="submit">Add</Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}