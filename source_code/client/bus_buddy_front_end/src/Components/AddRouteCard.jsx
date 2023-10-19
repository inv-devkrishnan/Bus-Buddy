import { React, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";

import RouteImage from "../Assets/route.jpg";
import axios from "axios";
import AddRouteLocation from "./AddRouteLocation";
import { Container, Row, Col } from "react-bootstrap";

export default function AddRouteCard() {
  const [locations, setLocations] = useState([]);
  const [sequenceId, setSequenceId] = useState(1);
  const [stopLocations, addStopLocation] = useState([]);
  const [locationAdded, setlocationAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const handleClose = () => {
    setShow(false);
    setlocationAdded(false);
  };
  const handleShow = () => setShow(true);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      addRoute();
    }

    setValidated(true);
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/get-location-data/")
      .then((res) => {
        setLocations(res.data);
      })
      .catch((err) => {});
  }, []);

  const appendStopLocation = (newStopLocation) => {
    console.log(newStopLocation);
    addStopLocation((StopLocation) => [...StopLocation, newStopLocation]);
  };

  const addRoute = () => {
    if (stopLocations.length >= 2) {
      const routeData=
      {
        start_point :  stopLocations[0].location_id,
        end_point : stopLocations[stopLocations.length-1].location_id,
        via : document.getElementById("via").value,
        distance : document.getElementById("distance").value,
        duration : document.getElementById("duration").value,
        travel_fare : document.getElementById("travel_fare").value,
        status : 0,
        location : stopLocations
      }
      console.log(routeData)
      setErrorMessage("");
    } else {
      setErrorMessage("Submission Failed: Atleast add 2 locations !");
    }
  };

  const getLocationName = (locationId) => {
    let locationName;
    locations.forEach((element) => {
      if (element.id === locationId) {
        locationName = element.location_name;
      }
    });
    return locationName;
  };

  return (
    <Container className="w-50">
      <Row>
        <Col>
          <Card className="mb-5 mt-5">
            <div className="d-flex align-items-center">
              <Card.Img variant="top w-25" src={RouteImage} />
              <h1>Add Route</h1>
            </div>
            <Card.Body>
              <Card.Title className="mb-3">Enter Route Details</Card.Title>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mt-3 mb-3">
                  <Form.Label>Add Locations</Form.Label>
                  <Form.Text className="d-flex">
                    Add all the locations in the acending order of arival during
                    this route.
                  </Form.Text>
                  <Button
                    className="d-block mt-2 mb-2"
                    variant="success"
                    onClick={handleShow}
                  >
                    Add Location
                  </Button>
                  {stopLocations.length > 0 && (
                    <div>
                      <Table className="w-75">
                        <thead>
                          <tr>
                            <th>S.no</th>
                            <th>Location Name</th>
                            <th>Location Stops</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stopLocations.map((stopLocation) => (
                            <tr key={stopLocation.seq_id}>
                              <td>{stopLocation.seq_id}</td>
                              <td>
                                {getLocationName(stopLocation.location_id)}
                              </td>
                              <td>
                                <ul>
                                  {stopLocation.pick_and_drop.map((stops) => (
                                    <li key={stops.bus_stop}>
                                      {stops.bus_stop}
                                    </li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Button
                        variant="danger"
                        onClick={() => {
                          addStopLocation([]);
                          setSequenceId(1);
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Via Location</Form.Label>
                  <Form.Control
                    id ="via"
                    type="text"
                    placeholder="Enter the location"
                    pattern="^[a-zA-Z]+$"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide valid Via location
                  </Form.Control.Feedback>
                  <Form.Text muted>
                    Via is the location that helps the travellers to identify in
                    which way the bus travels
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <InputGroup>
                  <Form.Control
                    id="duration"
                    type="number"
                    step={0.1}
                    min={1}
                    max={500}
                    maxLength={6}
                    placeholder="Enter the total time"
                    required
                  />
                  <InputGroup.Text>hrs</InputGroup.Text>
                  </InputGroup>
                  
                 
                  <Form.Control.Feedback type="invalid">
                    Please provide valid Duration
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Distance</Form.Label>
                  <InputGroup>
                    <Form.Control
                      id="distance"
                      type="number"
                      step={0.01}
                      min={1}
                      max={100000}
                      placeholder="Enter the total distance"
                      required
                    />
                    <InputGroup.Text>km</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                    Please provide valid Distance
                  </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Travel fare</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>&#8377;</InputGroup.Text>
                    <Form.Control
                      id="travel_fare"
                      type="number"
                      placeholder="Enter the travel fare"
                      min={0}
                      max={1000000}
                      required
                      step="0.01"
                    />
                    <Form.Control.Feedback type="invalid">
                    Please provide valid travel fare
                  </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <label className="text-danger d-block">{errorMessage}</label>
                <Button variant="primary mt-2" type="submit">
                  Submit
                </Button>
              </Form>
            </Card.Body>
            <AddRouteLocation
              show={show}
              handleClose={handleClose}
              locations={locations}
              appendStopLocation={appendStopLocation}
              sequenceId={sequenceId}
              setSequenceId={setSequenceId}
              locationAdded={locationAdded}
              setlocationAdded={setlocationAdded}
              stopLocations={stopLocations}
            ></AddRouteLocation>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
