import React from 'react'
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { axiosApi } from "../../../utils/axiosApi";


export default function Addtrips() {
    const handleSubmit = async (e) => {

    
        try {
          const response = await axiosApi.post("http://127.0.0.1:8000/bus-owner/add-trip/", {
            user: 1,

          });
    
          if (response.status === 200) {
            console.log("Inserted");
            console.log(response);
            const data =  response.data.bus
            console.log(data);
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
                      <Form.Label>Bus Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Bus name"
                        onChange={(e) => {
                        // setBusName(e.target.value);
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
                        //   setPlateNo(e.target.value);
                        }}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-5">
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                      <Form.Label>Bus Type</Form.Label>
                      <Form.Control
                        as="select"
                        // onChange={(e) => setBusType(e.target.value)}
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
                        // onChange={(e) => setBusSeatType(e.target.value)}
                        // value={bus_seat_type}
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
                        // onChange={(e) => setBusAC(e.target.value)}
                        // value={bus_ac}
                      >
                        <option value="">Select option</option>
                        <option value="0"> A/C </option>
                        <option value="1"> Non A/C </option>
                      </Form.Control>
                    </Form.Group>
                  </Row>
                  <div style={{ paddingTop: "1.5rem" }}>
                    <Button type="submit">Add</Button>
                  </div>
                </Form>
              </div>
            </Card.Body>
          </Card>
        </div>
      );
    }
