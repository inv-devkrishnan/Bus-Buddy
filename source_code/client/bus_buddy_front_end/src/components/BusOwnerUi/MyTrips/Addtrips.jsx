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
import { addMonths } from "date-fns";
import { axiosApi } from "../../../utils/axiosApi";

export default function Addtrips() {
  const [busData, setBusData] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const [bus, setBus] = useState("");
  const [route, setRoute] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const navi = useNavigate();

  const reset= () => {
    setBusData([]);
    setRouteData([]);

    document.getElementById("bus").value = "";
    document.getElementById("route").value = "";
  }

  const callFunction = (start, end) => {
    axiosApi
      .get(`bus-owner/view-available-bus/?start=${start}&end=${end}`)
      .then((response) => {
        setBusData(response.data);
      })
      .catch((error) => console.error("Error fetching Bus data:", error));

    axiosApi
      .get(`/bus-owner/view-routes/`)
      .then((response) => {
        setRouteData(response.data.results);
      })
      .catch((error) => console.error("Error fetching Route data:", error));
  };

  const callApi = async (formattedStartDate, formattedEndDate) => {
     await axiosApi.post("bus-owner/add-trip/", {
      bus: bus,
      route: route,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    })

    .then((response)=>{
      Swal.fire({
        icon: "success",
        title: "Added Successfully",
        text: "Trip added successfully",
      });
    })
    .catch((error)=>{
      if(error?.response?.data?.message === "The route's start time has already passed for today"){
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "The route's start time has already passed for today",
        });
      }
    })
  };

  const dates = (selectedStartDate, selectedEndDate) => {
    console.log(selectedStartDate);
    const today = new Date();
    const today_date = today
      ? new Date(today.getTime() - today.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0]
      : null;
    const start = selectedStartDate
      ? new Date(
          selectedStartDate.getTime() -
            selectedStartDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0]
      : null;

    const end = selectedEndDate
      ? new Date(
          selectedEndDate.getTime() -
            selectedEndDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0]
      : null;

    if (!start || start < today_date) {
      setStartDateError(
        "Start date should be present date or in the future and in the range of the period"
      );
    } else {
      setStartDateError("");
    }
    if (!end || end < start) {
      setEndDateError(
        "End date should be the same as the start date or a future date within the period"
      );
    } else {
      setEndDateError("");
    }
    callFunction(start, end);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedStartDate = selectedStartDate
        ? new Date(
            selectedStartDate.getTime() -
              selectedStartDate.getTimezoneOffset() * 60000
          )
            .toISOString()
            .split("T")[0]
        : null;

      const formattedEndDate = selectedEndDate
        ? new Date(
            selectedEndDate.getTime() -
              selectedEndDate.getTimezoneOffset() * 60000
          )
            .toISOString()
            .split("T")[0]
        : null;

      // Call the custom date validation
      dates(selectedStartDate, selectedEndDate);

      // Check for errors from the custom validation
      if (startDateError || endDateError) {
        // Display an error message using Swal if there are errors
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid dates. Please check your selected dates.",
        });
        return; // Stop execution if there are errors
      }

      // Proceed with the API call if there are no errors
      callApi(formattedStartDate, formattedEndDate);
      navi("/BusHome/view-trips");
    } catch (error) {
      console.error("Error adding Trip:", error);
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
        marginRight: "5%",
        paddingTop: "2.5%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          paddingTop: "3%",
          boxShadow: "5px 5px 30px 0 rgba(29, 108, 177, 0.5)",
          width: "40%",
          height: "28%",
        }}
      >
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>Add Trip</Card.Title>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Form onSubmit={handleSubmit} style={{ paddingTop: "1.5%" }}>
              <Row className="mb-2">
                <Form.Group as={Col} md="6">
                  <Form.Label htmlFor="startDate">Start Date :</Form.Label>
                  <DatePicker
                    minDate={new Date()} // Disable dates before today
                    maxDate={addMonths(new Date(), 6)}
                    name="startDate"
                    id="startDate"
                    selected={selectedStartDate}
                    onChange={(date) => {setSelectedStartDate(date);reset()}}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    required
                  />
                  {startDateError && (
                    <div style={{ color: "red", fontSize: "11px" }}>
                      {startDateError}
                    </div>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label htmlFor="endDate">End Date :</Form.Label>
                  <DatePicker
                    selected={selectedEndDate}
                    onChange={(date) => {setSelectedEndDate(date);reset()}}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()} // Disable dates before today
                    maxDate={addMonths(new Date(), 6)}
                    name="endDate"
                    id="endDate"
                    required
                  />
                  {endDateError && (
                    <div style={{ color: "red", fontSize: "11px" }}>
                      {endDateError}
                    </div>
                  )}
                </Form.Group>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    style={{ marginTop: "2%", width: "35%" }}
                    type="button"
                    onClick={() => dates(selectedStartDate, selectedEndDate)}
                  >
                    Search
                  </Button>
                </div>
                <p style={{ fontSize: "11px" }}>
                  Press the search button to search for buses available for the
                  dates you have entered
                  <br />
                  Please Select the bus once again if you have changed the dates
                </p>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col} md="6">
                  <Form.Label>Bus</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      setBus(e.target.value);
                    }}
                    id="bus"
                    data-testid="bus-select"
                    required
                  >
                    <option value="">Select option</option>
                    {busData.map((bus) => (
                      <option key={bus.id} value={bus.id}>
                        {bus.bus_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Route</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      setRoute(e.target.value);
                    }}
                    id="route"
                    data-testid="route-select"
                  >
                    <option value="">Select option</option>
                    {routeData.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.start_point_name} - {route.end_point_name}(via -
                        {route.via})
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Row>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "5%",
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
