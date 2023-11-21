import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormik } from "formik";
import { UpdateTripSchema} from "../UpdateTripSchema"
import { axiosApi } from "../../../utils/axiosApi";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Updatetrips() {
  const location = useLocation();
  const trip = location.state;
  const [busData, setBusData] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const [currentTripData, setCurrentTripData] = useState([]);
  let id = trip;

  const onSubmit = async (e) => {
    try {
      await axiosApi.put(
        `http://127.0.0.1:8000/bus-owner/update-trip/${formik.values.id}/`,
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
      const bus = { id: id };
      console.log(bus);
    } catch (error) {
      console.error("Error updating:", error);
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

  useEffect(() => {
    // Fetch Bus data
    axiosApi
      .get("bus-owner/view-bus/")
      .then((response) => {
        setBusData(response.data.results);
      })
      .catch((error) => console.error("Error fetching Bus data:", error));

    // Fetch Route data
    axiosApi
      .get("bus-owner/view-routes/")
      .then((response) => {
        setRouteData(response.data.results);
      })
      .catch((error) => console.error("Error fetching Route data:", error));

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
        });
      })
      .catch((err) => {
        console.log(err.response);
        alert("Trip does not exist!!");
      });
  }, []);

  console.log(formik.errors);
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
          height: "30rem",
          paddingTop: "3rem",
          boxShadow: "5px 5px 30px 0 rgba(29, 108, 177, 0.5)",
        }}
      >
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>Update Trip</Card.Title>
          <div style={{ display: "flex" }}>
            <Form onSubmit={formik.handleSubmit} style={{ paddingTop: "3rem" }}>
              <Row className="mb-5">
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                  <Form.Label>Bus Name</Form.Label>
                  <Form.Control
                    name="busName"
                    as="select"
                    value={formik.values.busName || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select option</option>
                    {busData.map((bus) => (
                      <option key={bus.id} value={bus.id}>
                        {bus.bus_name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.busName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                  <Form.Label>Route</Form.Label>
                  <Form.Control
                    name="routeName"
                    as="select"
                    value={formik.values.routeName || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select option</option>
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

                <Form.Group as={Col} md="6" controlId="validationCustom03">
                  <Form.Label>Start Date</Form.Label>
                  <DatePicker
                    selected={formik.values.startdate}
                    onChange={(date) =>
                      formik.setFieldValue("startdate", date)
                    }
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom04">
                  <Form.Label>End Date</Form.Label>
                  <DatePicker
                    selected={formik.values.enddate}
                    onChange={(date) =>
                      formik.setFieldValue("enddate", date,false)
                    }
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                </Form.Group>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  <Form.Group as={Col} md="6" controlId="validationCustom05">
                    <Form.Label>Arrival Time</Form.Label>
                    <Form.Control
                      type="time"
                      placeholder="Enter time"
                      value={formik.values.starttime || ""}
                      onChange={(e) =>
                        formik.setFieldValue("starttime", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom06">
                    <Form.Label>Departure Time</Form.Label>
                    <Form.Control
                      type="time"
                      placeholder="Enter time"
                      value={formik.values.endtime || ""}
                      onChange={(e) =>
                        formik.setFieldValue("endtime", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </div>
              </Row>
              <div style={{ paddingTop: "1.5rem" }}>
                <Button type="submit">Update</Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
