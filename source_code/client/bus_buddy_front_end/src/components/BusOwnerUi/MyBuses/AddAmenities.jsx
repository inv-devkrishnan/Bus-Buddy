import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useLocation,useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { axiosApi } from "../../../utils/axiosApi";
import "./Addamenities.css";

export default function Addamenities() {
  const location = useLocation();
  const bus = location.state;
  const navi = useNavigate();
  const [formState, setFormState] = useState({
    emergency_no: 0,
    water_bottle: 0,
    charging_point: 0,
    usb_port: 0,
    blankets: 0,
    pillows: 0,
    reading_light: 0,
    toilet: 0,
    snacks: 0,
    tour_guide: 0,
    cctv: 0,
  });

  const handleCheckboxChange = (amenity) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      [amenity]: prevFormState[amenity] === 1 ? 0 : 1,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosApi.post(
        "bus-owner/add-amenities/",
        {
          bus: bus,
          ...formState,
        }
      );

      if (response.status === 200) {
        console.log("Amenities Inserted");
        Swal.fire({
          icon: "success",
          title: "Added Successfully",
          text: "Bus Amenities added successfully",
        });
      }
      navi("/BusHome");
    } catch (error) {
      console.error("Error adding amenities:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error adding Bus Amenities",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginRight: "5rem",
        paddingTop: "3rem",
      }}
    >
      <Card
        style={{
          width: "35rem",
          height: "40rem",
          paddingTop: "1rem",
          boxShadow: "5px 5px 30px 0 rgba(29, 108, 177, 0.5)",
        }}
      >
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>Amenities</Card.Title>
          <div style={{ display: "flex",flexDirection:"column" }}>
            <Form onSubmit={handleSubmit}>
              {Object.keys(formState).map((amenity) => (
                <div key={amenity} className="mb-4">
                  <Form.Check
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    label ={ amenity.replace(/_/g, ' ').replace(/(^|\s)\S/g, match => match.toUpperCase())}
                    checked={formState[amenity] === 1}
                    onChange={() => handleCheckboxChange(amenity)}
                    data-testid = "check-button"
                  />
                </div>
              ))}
              <div style={{ textAlign: "center" }}>
                <Button type="submit">Add Amenities</Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
