import { React, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import RouteImage from "../Assets/route.jpg";
import axios from "axios";

export default function AddRouteCard() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/get-location-data/")
      .then((res) => {
        setLocations(res.data);
        console.log(locations);
        console.log(locations[0]["location_name"]);
      })
      .catch((err) => {});
  }, []);

  return (
    <Card style={{ width: "50rem" }}>
      <Card.Img variant="top" src={RouteImage} />
      <Card.Body>
        <Card.Title>Enter Route Details</Card.Title>
        <Card.Text>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Starting location</Form.Label>
              {locations && (
                <Form.Select
                  aria-label="Default select example"
                  name="starting"
                >
                  {locations.map((location) => (
                    <>
                      <option key={location.id} value={location.id}>
                        {location.location_name}
                      </option>
                    </>
                  ))}
                </Form.Select>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Ending location</Form.Label>
              {locations && (
                <Form.Select aria-label="Default select example" name="ending">
                  {locations.map((location) => (
                    <>
                      <option key={location.id} value={location.id}>
                        {location.location_name}
                      </option>
                    </>
                  ))}
                </Form.Select>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Via</Form.Label>
              <Form.Control type="text" placeholder="Enter the location" />
              <Form.Text muted>
                Via is the location that helps the travellers to identify in
                which way the bus travells
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Duration</Form.Label>
              <Form.Control type="time" placeholder="Enter the total time" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Distance</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  step={0.5}
                  placeholder="Enter the total distance"
                />
                <InputGroup.Text>km</InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Travel fare</Form.Label>
              <InputGroup>
                <InputGroup.Text>&#8377;</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="Enter the travel fare"
                  min={0}
                />
              </InputGroup>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
