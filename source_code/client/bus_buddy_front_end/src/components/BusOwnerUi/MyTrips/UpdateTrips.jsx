import React, { useState, useEffect } from "react";
import {  useLocation,useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormik } from "formik";
import { UpdateTripSchema} from "../UpdateTripSchema"
import { axiosApi } from "../../../utils/axiosApi";
import { format,addMonths } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";


export default function Updatetrips() {
  const location = useLocation();
  const trip = location.state;
  const [busData, setBusData] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const [currentTripData, setCurrentTripData] = useState([]);
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const navi = useNavigate();
  

  const onSubmit = async (e) => {
    const startTimeDifference = new Date(formik.values.startdate).getTime() - new Date().getTime();
    const hoursUntilStartTime = startTimeDifference / (1000 * 60 * 60);
      if (hoursUntilStartTime < 48) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "The start time of the trip should be at least 48 hours from now.",
        });
        return;
      }
    try { 
      const response = await axiosApi.put(
        `bus-owner/update-trip/${formik.values.id}/`,
        {
          bus: formik.values.busName,
          route: formik.values.routeName,
          start_date: format(formik.values.startdate, "yyyy-MM-dd"),
          end_date: format(formik.values.enddate, "yyyy-MM-dd"),
          start_time: formik.values.starttime,
          end_time: formik.values.endtime,
        }
      );
      console.log("updated");
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          text: "trip Updated successfully",
        });
      }
      navi("/BusHome");
    } catch (error) {
      console.error("Error updating:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error updating trip",
      });
    }
  };
  const formik = useFormik({
    initialValues: {
      busName: "",
      routeName: "",
      startdate: null,
      enddate: null,
      starttime: "",
      endtime: "",
    },
    validationSchema: UpdateTripSchema,
    onSubmit
  });
console.log(formik.errors);
  const dates = (selectedStartDate, selectedEndDate) => {
    // Fetch Bus data
    if (formik.values.startdate && formik.values.enddate) {
      const start = new Date(formik.values.startdate).toISOString().split("T")[0];
      const end = new Date(formik.values.enddate).toISOString().split("T")[0];
      if (!start ) {
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
  
      axiosApi
        .get(`bus-owner/view-available-bus/?start=${start}&end=${end}`)
        .then((response) => {
          setBusData(response.data);
          console.log(response.data)
        })
        .catch((error) => console.error("Error fetching Bus data:", error));
    }
  };

  useEffect(() => {
    // Fetch Bus data without date filtering
    axiosApi
      .get(`bus-owner/get-valid-bus/`)
      .then((response) => {
        setBusData(response.data.results);
      })
      .catch((error) => console.error("Error fetching Bus data:", error));
    },[]);
  
  useEffect(() => {
    // Fetch Route data
    axiosApi
      .get("bus-owner/view-routes/")
      .then((response) => {
        setRouteData(response.data.results);
      })
      .catch((error) => console.error("Error fetching Route data:", error));
  }, []);
  
  useEffect(() => {
    // Fetch current trip data
    axiosApi
      .get(`bus-owner/update-trip/${trip}/`)
      .then((res) => {
        setCurrentTripData(res.data);
        formik.setValues({
          id: res.data["id"],
          busName: res.data["bus"],
          routeName: res.data["route"],
          startdate: new Date(res.data["start_date"]),
          enddate: new Date(res.data["end_date"]),
          starttime: res.data["start_time"],
          endtime: res.data["end_time"],
        },
        console.log(currentTripData)
        );
      }
      )
      .catch((err) => {
        console.log(err.response);
        alert("Trip does not exist!!");
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(formik.errors);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginRight: "5%",
        paddingTop: "5%",
      }}
    >
      <Card
        style={{
          width: "40%",
          height: "30%",
          paddingTop: "3%",
          boxShadow: "5px 5px 30px 0 rgba(29, 108, 177, 0.5)",
        }}
      >
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>Update Trip</Card.Title>
          <div style={{ display: "flex" }}>
            <Form onSubmit={formik.handleSubmit} style={{ paddingTop: "1.5%" }}>
              <Row className="mb-5">
                <Form.Group as={Col} md="6" >
                  <Form.Label htmlFor="startDate">Start Date:</Form.Label>
                  <DatePicker
                    selected={formik.values.startdate}
                    onChange={(date) =>
                      formik.setFieldValue("startdate", date)
                    }
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()} // Disable dates before today
                    maxDate={addMonths(new Date(), 6)}
                    name="startDate"
                    id="startDate"
                    data-testid="start-date"
                    required
                  />
                  {startDateError && (
                    <div style={{ color: "red", fontSize: "11px" }}>
                      {startDateError}
                    </div>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="6" >
                  <Form.Label htmlFor="endDate">End Date :</Form.Label>
                  <DatePicker
                    selected={formik.values.enddate}
                    onChange={(date) =>
                      formik.setFieldValue("enddate", date,false)
                    }
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()} // Disable dates before today
                    maxDate={addMonths(new Date(), 6)}
                    name = "endDate"
                    id= "endDate"
                    required
                  />
                  {endDateError && (
                    <div style={{ color: "red", fontSize: "11px" }}>
                      {endDateError}
                    </div>
                  )}
                </Form.Group>
                <div style={{display:"flex",justifyContent:"center"}}>
                  <Button style={{marginTop:"2%",width:"35%",}} type="button" onClick={() => dates(formik.values.startdate, formik.values.enddate)}>search</Button>
                </div>
                <p style={{fontSize:"11px"}}>Press the search button to search for buses available for the new dates you have entered<br/>Please Select the bus once again if you have changed the dates</p>
                <Form.Group as={Col} md="6">
                  <Form.Label>Bus Name</Form.Label>
                  <Form.Control
                    name="busName"
                    as="select"
                    value={formik.values.busName || ""}
                    onChange={formik.handleChange}
                    data-testid="bus-select"
                    required
                    isInvalid={formik.touched.busName && formik.errors.busName}
                  >Bus must be a positive number
                    <option value="">Selected Option</option>
                    { busData.map((bus) => (
                      <option key={bus.id} value={bus.id}>
                        {bus.bus_name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.busName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Route</Form.Label>
                  <Form.Control
                    name="routeName"
                    as="select"
                    value={formik.values.routeName || ""}
                    onChange={formik.handleChange}
                    data-testid = "route-select"
                    required
                    isInvalid={formik.touched.routeName && formik.errors.routeName}
                  >
                    <option value="">Selected Option</option>
                    {routeData.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.start_point_name} - {route.end_point_name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.routeName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <div style={{ paddingTop: "1%",display:"flex",justifyContent:"center"}}>
                <Button type="submit">Update</Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
