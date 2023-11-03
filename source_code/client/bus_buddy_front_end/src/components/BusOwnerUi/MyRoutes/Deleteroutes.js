import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { axiosApi } from '../../../utils/axiosApi';

export default function Delete() {
  const user = useState(1);
  const location = useLocation();
  const bus = location.state;
  const validated = useState(false);

  const [id, setid] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id) {
      alert("Id cannot be empty");
    }
    axiosApi
      .put(`http://127.0.0.1:8000/bus-owner/deletebus/${bus}/`)
      .then((response) => {
        console.log("user:", user);

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
    <div
      style={{
        display: "flex",
        justifyContent: "right",
        marginRight: "5rem",
        paddingTop: "5rem",
      }}
    >
      <Card style={{ width: "35rem", height: "30rem", paddingTop: "3rem" }}>
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>Delete Bus</Card.Title>
          <Card.Text style={{ display: "flex" }}>
            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
              style={{ paddingTop: "3rem" }}
            >
              <Row className="mb-1">
                <Form.Group as={Col} md="7" controlId="validationCustom01">
                  <Form.Label>Bus ID</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    value={bus}
                    placeholder="Bus ID"
                    onChange={(e) => {
                      setid(e.target.value);
                    }}
                  />
                </Form.Group>
              </Row>
              <div style={{ paddingTop: "1.5rem" }}>
                <Button type="submit">Delete</Button>
              </div>
            </Form>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
