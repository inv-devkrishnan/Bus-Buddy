import React, { useState } from "react";
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
import { showLoadingAlert } from "../../common/loading_alert/LoadingAlert";

export default function Addrecurringtrip() {
  const [busData, setBusData] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const [bus, setBus] = useState("");
  const [route, setRoute] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedPeriodStartDate, setSelectedPeriodStartDate] = useState(null);
  const [selectedPeriodEndDate, setSelectedPeriodEndDate] = useState(null);
  const [recurrence, setRecurrence] = useState(0);
  const [startPeriodDateError, setStartPeriodDateError] = useState("");
  const [endPeriodDateError, setEndPeriodDateError] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const navi = useNavigate();

  const dates = (selectedPeriodStartDate, selectedPeriodEndDate) => {
    const today = new Date();
    const sixMonthsFromNow = new Date(today);
    sixMonthsFromNow.setMonth(today.getMonth() + 6);

    const today_date = today
      ? new Date(today.getTime() - today.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0]
      : null;

    const start = selectedPeriodStartDate
      ? new Date(
          selectedPeriodStartDate.getTime() -
            selectedPeriodStartDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0]
      : null;

    const end = selectedPeriodEndDate
      ? new Date(
          selectedPeriodEndDate.getTime() -
            selectedPeriodEndDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0]
      : null;
    

    if (start < today_date || start > sixMonthsFromNow) {
      setStartPeriodDateError(
        "Period start date should be present date or in the future and less than 6 months"
      );
    } else {
      setStartPeriodDateError("");
    }
    if (end < start || end > sixMonthsFromNow) {
      setEndPeriodDateError(
        "End date should be the same as the start date or a future and less than 6 months"
      );
    } else {
      setEndPeriodDateError("");
    }
    if(!start ){
      setStartPeriodDateError("Period start date is required")
    }
    if(!end){
      setEndPeriodDateError("Period end date is required")
    }
    
    // Fetch Bus data
    axiosApi
      .get(`bus-owner/view-available-bus/?start=${start}&end=${end}`)
      .then((response) => {
        setBusData(response.data);
      })
      .catch((error) =>
        console.error("Error fetching Bus data:", error)
      );

    // Fetch Route data
    axiosApi
      .get("bus-owner/view-routes/")
      .then((response) => {
        setRouteData(response.data.results);
      })
      .catch((error) =>
        console.error("Error fetching Route data:", error)
      );
  };

  console.log(busData);
  console.log(routeData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date();
    const sixMonthsFromNow = new Date(today);
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    showLoadingAlert("Adding recurring trips");

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

      const start = selectedPeriodStartDate
        ? new Date(
            selectedPeriodStartDate.getTime() -
              selectedPeriodStartDate.getTimezoneOffset() * 60000
          )
            .toISOString()
            .split("T")[0]
        : null;

      const end = selectedPeriodEndDate
        ? new Date(
            selectedPeriodEndDate.getTime() -
              selectedPeriodEndDate.getTimezoneOffset() * 60000
          )
            .toISOString()
            .split("T")[0]
        : null;

      const today_date = today
        ? new Date(today.getTime() - today.getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0]
        : null;

      if (
        !formattedStartDate ||
        formattedStartDate < today_date ||
        formattedStartDate > sixMonthsFromNow
      ) {
        setStartDateError(
          "Start date should be same as the present date or future dates and less than 6 months"
        );
      }
      else if(formattedStartDate < start ){
        setStartDateError("The start date should be a date in period start and end dates")
      } 
      else {
        setStartDateError("");
      }

      if (
        !formattedEndDate ||
        formattedEndDate < formattedStartDate ||
        formattedEndDate > sixMonthsFromNow
      ) {
        setEndDateError(
          "End date should be either start date or any future dates and less than 6 months"
        );
      }
      else if(formattedEndDate > end ){
        setEndDateError("The end date should be a date in period start and end dates and less than start date")
      } 
      else {
        setEndDateError("");
      }

      const response = await axiosApi.post(
        `bus-owner/add-recurring-trip/?start=${start}&end=${end}`,
        {
          bus: bus,
          route: route,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          recurrence: parseInt(recurrence),
        }
      );
      if (response.status === 200) {
        console.log("trips Inserted");
        Swal.close();
        Swal.fire({
          icon: "success",
          title: "Added Successfully",
          text: "Recurring trip added successfully",
        });
      }
      navi("/BusHome");
    } catch (error) {
      console.error("Error adding trips:", error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error adding Recurring trip",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginRight: "5%",
        paddingTop: "2.5%",
      }}
    >
      <Card
        style={{
          width: "35%",
          height: "37%",
          paddingTop: "3%",
          boxShadow: "5px 5px 30px 0 rgba(29, 108, 177, 0.5)",
        }}
      >
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>
            Add Recurring Trip
          </Card.Title>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Form onSubmit={handleSubmit} style={{ paddingTop: "1.5%" }}>
              <p style={{ fontSize: "13px" }}>
                Please select the period that you want your trip to reccur
              </p>
              <Row className="mb-2">
                <Form.Group as={Col} md="6">
                  <Form.Label htmlFor="periodStartDate">Start Date :</Form.Label>
                  <DatePicker
                    selected={selectedPeriodStartDate}
                    onChange={(date) => setSelectedPeriodStartDate(date)}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()} // Disable dates before today
                    maxDate={addMonths(new Date(), 6)}
                    data-testid="period-start-date"
                    name="periodStartDate"
                    id="periodStartDate"
                    required
                  />
                  {startPeriodDateError && (
                    <div style={{ color: "red", fontSize: "11px" }}>
                      {startPeriodDateError}
                    </div>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label htmlFor="periodEndDate">End Date :</Form.Label>
                  <DatePicker
                    selected={selectedPeriodEndDate}
                    onChange={(date) => setSelectedPeriodEndDate(date)}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()} // Disable dates before today
                    maxDate={addMonths(new Date(), 6)}
                    data-testid="period-end-date"
                    name="periodEndDate"
                    id="periodEndDate"
                    required
                  />
                  {endPeriodDateError && (
                    <div style={{ color: "red", fontSize: "11px" }}>
                      {endPeriodDateError}
                    </div>
                  )}
                </Form.Group>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    style={{ marginTop: "2%", width: "35%" }}
                    type="button"
                    onClick={() =>
                      dates(selectedPeriodStartDate, selectedPeriodEndDate)
                    }
                  >
                    search
                  </Button>
                </div>
                <p style={{ fontSize: "13px" }}>
                  Press the search button to search for buses available for the
                  dates you have entered
                </p>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col} md="6">
                  <Form.Label htmlFor="startDate">Start Date:</Form.Label>
                  <DatePicker
                    selected={selectedStartDate}
                    onChange={(date) => setSelectedStartDate(date)}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()} // Disable dates before today
                    maxDate={addMonths(new Date(), 6)}
                    name="startDate"
                    id="startDate"
                    required
                  />
                  {startDateError && (
                    <div style={{ color: "red", fontSize: "11px" }}>
                      {startDateError}
                    </div>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label htmlFor="endDate">End Date:</Form.Label>
                  <DatePicker
                    selected={selectedEndDate}
                    onChange={(date) => setSelectedEndDate(date)}
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
                <Form.Group as={Col} md="6">
                  <Form.Label>Bus</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      setBus(e.target.value);
                    }}
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
                    data-testid="route-select"
                    required
                  >
                    <option value="">Select option</option>
                    {routeData.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.start_point_name} - {route.end_point_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Recurrence Type</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setRecurrence(e.target.value)}
                    value={recurrence}
                    data-testid="recurrence-select"
                    required
                  >
                    <option value="0">Select option</option>
                    <option value="1"> Daily </option>
                    <option value="2"> Weekly </option>
                  </Form.Control>
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
