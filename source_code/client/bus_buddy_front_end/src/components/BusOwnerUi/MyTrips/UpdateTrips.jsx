import React, { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormik } from "formik";
import { UpdateBusSchema } from "../UpdateBusSchema";
import { axiosApi } from "../../../utils/axiosApi";

export default function Updatetrips() {
  
  const location = useLocation();
  const bus = location.state;
  const [busData, setBusData] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const navi = useNavigate();
  const [currentTripData, setCurrentTripData] = useState([]);
  console.log(bus);
  let id=bus;


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

  useEffect(() => {
    axiosApi
      .get(`http://127.0.0.1:8000/bus-owner/update-trip/${bus}/`)
      .then((res) => {
        setCurrentTripData(res.data);
      })
      .catch((err) => {
        console.log(err.response);
        alert("trip does not exist!!");
      });
  }, []);

  useEffect(() => {
    formik.setValues({
      id: currentTripData["id"],
      bus: currentTripData["bus"],
      route: currentTripData["route"],
      start_date: currentTripData["start_date"],
      end_date: currentTripData["end_date"],
      start_time: currentTripData["start_time"],
      end_time: currentTripData["end_time"],
    });
  }, [currentTripData]);

  const onSubmit = () => {
    // if (plate_no < 0 || plate_no > 10) {
    //   alert("Plate Number cannot exceed 10 , pleace remove Spaces in between ");
    // }

    try {
      axiosApi.put(`http://127.0.0.1:8000/bus-owner/update-trip/${formik.values.id}/`, {
        bus:formik.values.busName,
        route: formik.values.routeName,
        start_date: formik.values.startdate,
        end_date: formik.values.enddate,
        start_time: formik.values.starttime,
        end_time: formik.values.endtime,
      });
      console.log("updated");
      const bus = { id: id };
      console.log(bus);
    } 
    catch (error) {
      console.error("Error updating:", error);
    }
  };
  const formik = useFormik({
    initialValues: {
        bus: "",
        route: "",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time:""
    },
    validationSchema: UpdateBusSchema,
    onSubmit,
  });

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
          <Card.Title style={{ textAlign: "center" }}>Update Trip</Card.Title>
          <div style={{ display: "flex" }}>
            <Form onSubmit={formik.handleSubmit} style={{ paddingTop: "3rem" }}>
              <Row className="mb-5">
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                  <Form.Label>Bus Name</Form.Label>
                  <Form.Control
                    name="busseattype"
                    as="select"
                    value={formik.values.busName || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.busseattype && formik.errors.busseattype
                    }
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
                    name="busseattype"
                    as="select"
                    value={formik.values.routeName || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.busseattype && formik.errors.busseattype
                    }
                  >
                  <option value="">Select option</option>
                    {routeData.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.start_point_name} - {route.end_point_name}
                      </option>
                    ))}
                    </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.plateno}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    name="bustype"
                    as="text"
                    value={formik.values.startdate || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.bustype && formik.errors.bustype}
                  >
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.bustype}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    name="busseattype"
                    as="text"
                    value={formik.values.enddate || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.busseattype && formik.errors.busseattype
                    }
                  >
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.busseattype}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="validationCustom04">
                  <Form.Label>Bus A/C</Form.Label>
                  <Form.Control
                    name="busac"
                    as="select"
                    value={formik.values.busac || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.busac && formik.errors.busac}
                  >
                    <option value="">updated option</option>
                    <option value="0"> A/C </option>
                    <option value="1"> Non A/C </option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.busac}
                  </Form.Control.Feedback>
                </Form.Group>
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
