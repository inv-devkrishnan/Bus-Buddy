import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormik } from "formik";
import { UpdateBusSchema } from "./UpdateBusSchema";

export default function Updatebus() {
  const [id, setid] = useState(0);
  const [plate_no, setplate_no] = useState("");

  const navi = useNavigate();
  const [currentBusData, setCurrentBusData] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/Update-Bus/1/")
      .then((res) => {
        setCurrentBusData(res.data);
      })
      .catch((err) => {
        console.log(err.response);
        alert("Bus does not exist!!");
      });
  }, []);

  useEffect(() => {
    formik.setValues({
      id: currentBusData["id"],
      busName: currentBusData["bus_name"],
      plateno: currentBusData["plate_no"],
      bustype: currentBusData["bus_type"],
      busac: currentBusData["bus_ac"],
      busseattype: currentBusData["bus_seat_type"],
    });
  }, [currentBusData]);

  const onSubmit = () => {
    // if (plate_no < 0 || plate_no > 10) {
    //   alert("Plate Number cannot exceed 10 , pleace remove Spaces in between ");
    // }

    try {
      axios.put(`http://127.0.0.1:8000/Update-Bus/${formik.values.id}/`, {
        user: 1,
        bus_name:formik.values.busName,
        plate_no: formik.values.plateno,
        bus_type: formik.values.bustype,
        bus_ac: formik.values.busac,
        bus_seat_type: formik.values.busseattype,

      });
      console.log("updated");
      const bus = { id: id };
      console.log(bus);
      navi("/Updateamenities", { state: id });
    } catch (error) {
      console.error("Error updating:", error);
    }
  };
  const formik = useFormik({
    initialValues: {
      id: "",
      busName: "",
      plateno: "",
      bustype: "",
      busac: "",
      busseattype:""
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
      <Card style={{ width: "35rem", height: "30rem", paddingTop: "3rem" }}>
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>Update Bus</Card.Title>
          <div style={{ display: "flex" }}>
            <Form onSubmit={formik.handleSubmit} style={{ paddingTop: "3rem" }}>
              <Row className="mb-1">
                <Form.Group as={Col} md="3" controlId="validationCustom01">
                  <Form.Label>Bus ID</Form.Label>
                  <Form.Control
                    required
                    name="id"
                    type="text"
                    value={formik.values.id || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.id && formik.errors.id}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-5">
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                  <Form.Label>Bus Name</Form.Label>
                  <Form.Control
                    name="busName"
                    type="text"
                    value={formik.values.busName || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.busName && formik.errors.busName}
                  />

                  <Form.Control.Feedback type="invalid">
                    {formik.errors.busName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                  <Form.Label>Plate Number</Form.Label>
                  <Form.Control
                    name="plateno"
                    type="text"
                    value={formik.values.plateno || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.plateno && formik.errors.plateno}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.plateno}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Bus Type</Form.Label>
                  <Form.Control
                    name="bustype"
                    as="select"
                    value={formik.values.bustype || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.bustype && formik.errors.bustype}
                  >
                    <option value="">updated option</option>
                    <option value="0"> Low floor </option>
                    <option value="1"> Multi axel </option>
                    <option value="2"> Both </option>
                  </Form.Control>

                  <Form.Control.Feedback type="invalid">
                    {formik.errors.bustype}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Bus Seat Type</Form.Label>
                  <Form.Control
                    name="busseattype"
                    as="select"
                    value={formik.values.busseattype || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.busseattype && formik.errors.busseattype
                    }
                  >
                    <option value="">updated option</option>
                    <option value="0"> Sleeper </option>
                    <option value="1"> Seater </option>
                    <option value="2"> Both </option>
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
