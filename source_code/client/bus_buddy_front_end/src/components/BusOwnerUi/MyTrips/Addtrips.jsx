import { React, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { axiosApi } from "../../../utils/axiosApi";

export default function Addtrips() {
  const [busData, setBusData] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const [bus,setBus] = useState("")
  const [route,setRoute] = useState("")
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    // Fetch Bus data
    axiosApi
      .get("http://localhost:8000/bus-owner/view-bus/")
      .then((response) => {
        setBusData(response.data.results);
      })
      .catch((error) => console.error("Error fetching Bus data:", error));

    // Fetch Route data
    axiosApi
      .get("http://127.0.0.1:8000/bus-owner/view-routes/")
      .then((response) => {
        setRouteData(response.data.results);
      })
      .catch((error) => console.error("Error fetching Route data:", error));
  }, []);
  console.log(busData);
  console.log(routeData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosApi.post(
        "http://127.0.0.1:8000/bus-owner/add-trip/",
        {
          bus: bus,
          route: route,
          start_date: selectedDate, 
          end_date: selectedDate, 
          start_time: startTime,
          end_time: endTime,
        }
      );

      if (response.status === 200) {
        console.log("Inserted");
        console.log(response);
        const data = response.data.bus;
        console.log(data);
      }
    } catch (error) {
      console.error("Error adding trip:", error);
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
      <Card
        style={{
          width: "35rem",
          height: "33rem",
          paddingTop: "3rem",
          boxShadow: "5px 5px 30px 0 rgba(29, 108, 177, 0.5)",
        }}
      >
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>Add Trip</Card.Title>
          <div style={{ display: "flex" }}>
            <Form onSubmit={handleSubmit} style={{ paddingTop: "3rem" }}>
              <Row className="mb-2">
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                  <Form.Group as={Col} md="6" controlId="validationCustom03">
                    <Form.Label>Bus</Form.Label>
                    <Form.Control
                      as="select"
                      onChange={(e) => {
                        setBus(e.target.value);
                      }}
                    >
                      <option value="">Select option</option>
                      {busData.map((bus) => (
                        <option key={bus.id} value={bus.id}>
                          {bus.bus_name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Route</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      setRoute(e.target.value);
                    }}
                  >
                    <option value="">Select option</option>
                    {routeData.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.start_point_name} - {route.end_point_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Row>
              <Row className="mb-5">
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                  <Form.Label>Start Date :</Form.Label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                  <Form.Label>End Date:</Form.Label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                  />
                </Form.Group>
                <div style={{display:"flex",justifyContent:"space-around"}}>
                <Form.Group className="mb-5">
                  <Form.Label>Arrival Time</Form.Label>
                  <Form.Control
                    type="time"
                    placeholder="Enter time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                    }}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-6">
                  <Form.Label>Departure Time</Form.Label>
                  <Form.Control
                    type="time"
                    placeholder="Enter time"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                    }}
                    required
                  />
                </Form.Group>
                </div>
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
