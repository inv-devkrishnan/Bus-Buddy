import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { axiosApi } from "../../../utils/axiosApi";

export default function Addtrips() {
  const [busData, setBusData] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const [bus, setBus] = useState("");
  const [route, setRoute] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [searchMode, setSearchMode] = useState(true);
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const navi = useNavigate();


  const dates = (selectedStartDate, selectedEndDate) => {
    console.log(selectedStartDate)
    const today = new Date();
    const today_date =today
    ? new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0]
  : null;
    const start = selectedStartDate
    ? new Date(selectedStartDate.getTime() - selectedStartDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0]
    : null;

  const end = selectedEndDate
    ? new Date(selectedEndDate.getTime() - selectedEndDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0]
    : null;

    if(!start || start < today_date ){
      setStartDateError("Start date should be present date or in the future and in the range of the period");
    } else {
      setStartDateError(""); 
    }
    if (!end || end < start){
      setEndDateError("End date should be the same as the start date or a future date within the period");
    } else {
      setEndDateError(""); 
    }
    // Fetch Bus data
    axiosApi
      .get(`http://127.0.0.1:8000/bus-owner/view-available-bus/?start=${start}&end=${end}`)
      .then((response) => {
        setBusData(response.data);
      })
      .catch((error) => console.error("Error fetching Bus data:", error));

    // Fetch Route data
    axiosApi
      .get("http://127.0.0.1:8000/bus-owner/view-routes/")
      .then((response) => {
        setRouteData(response.data.results);
        setSearchMode(false)
      })
      .catch((error) => console.error("Error fetching Route data:", error));
  };
  console.log(busData);
  console.log(routeData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const formattedStartDate = selectedStartDate
  ? new Date(selectedStartDate.getTime() - selectedStartDate.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0]
  : null;

const formattedEndDate = selectedEndDate
  ? new Date(selectedEndDate.getTime() - selectedEndDate.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0]
  : null;

      const response = await axiosApi.post(
        "http://127.0.0.1:8000/bus-owner/add-trip/",
        {
          bus: bus,
          route: route,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          start_time: startTime,
          end_time: endTime,
        }
      );

      if (response.status === 200) {
        console.log("Amenities Inserted");
        Swal.fire({
          icon: "success",
          title: "Added Successfully",
          text: "Trip added successfully",
        });
      }
      navi("/BusHome");
    } catch (error) {
      console.error("Error adding amenities:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error adding Trip",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginRight: "5rem",
        paddingTop: "2.5rem",
      }}
    >
      <Card
        style={{
          width: "35rem",
          height: "35rem",
          paddingTop: "3rem",
          boxShadow: "5px 5px 30px 0 rgba(29, 108, 177, 0.5)",
        }}
      >
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>Add Trip</Card.Title>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Form onSubmit={handleSubmit} style={{ paddingTop: "1.5rem" }}>
              <Row className="mb-2">
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                  <Form.Label>Start Date :</Form.Label>
                  <DatePicker
                    selected={selectedStartDate}
                    onChange={(date) => setSelectedStartDate(date)}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                  {startDateError && <div style={{ color: 'red',fontSize:"11px" }}>{startDateError}</div>}
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                  <Form.Label>End Date:</Form.Label>
                  <DatePicker
                    selected={selectedEndDate}
                    onChange={(date) => setSelectedEndDate(date)}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                  {endDateError && <div style={{ color: 'red',fontSize:"11px"}}>{endDateError}</div>}
                </Form.Group>
                <div style={{display:"flex",justifyContent:"center"}}>
                  <Button style={{marginTop:"2%",width:"35%",}} type="button" onClick={() => dates(selectedStartDate, selectedEndDate)}>search</Button>
                </div>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col} md="6" controlId="validationCustom01">
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
                <Form.Group as={Col} md="6" controlId="validationCustom03">
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
                        {route.start_point_name} - {route.end_point_name}(via -{route.via})
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                  <Form.Group className="mb-6">
                    <Form.Label>Arrival Time</Form.Label>
                    <Form.Control
                      type="time"
                      placeholder="Enter time"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                      }}
                      // required={searchMode}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="mb-5">
                    <Form.Label>Departure Time</Form.Label>
                    <Form.Control
                      type="time"
                      placeholder="Enter time"
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value);
                      }}
                      // required={searchMode}
                      disabled
                    />
                  </Form.Group>
              </Row>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button type="submit">Add</Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
