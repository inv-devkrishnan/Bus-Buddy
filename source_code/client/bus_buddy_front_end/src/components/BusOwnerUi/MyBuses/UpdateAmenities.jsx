import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useLocation,useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { axiosApi } from "../../../utils/axiosApi";
import "./Addamenities.css";

export default function Updateamenities() {
  const [currentAmenitiesData, setCurrentAmenitiesData] = useState([]);
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
  const location = useLocation();
  const bus = location.state;
  useEffect(() => {
    axiosApi
      .get(`bus-owner/update-amenities/${bus}/`)
      .then((res) => {
        setCurrentAmenitiesData(res.data);
      })
      .catch((err) => {
        console.log(err.response);
        alert("Bus does not exist!!");
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    setFormState({
      emergency_no: currentAmenitiesData.emergency_no,
      water_bottle: currentAmenitiesData.water_bottle,
      charging_point: currentAmenitiesData.charging_point,
      usb_port: currentAmenitiesData.usb_port,
      blankets: currentAmenitiesData.blankets,
      pillows: currentAmenitiesData.pillows,
      reading_light: currentAmenitiesData.reading_light,
      toilet: currentAmenitiesData.toilet,
      snacks: currentAmenitiesData.snacks,
      tour_guide: currentAmenitiesData.tour_guide,
      cctv: currentAmenitiesData.cctv,
    });
  }, [currentAmenitiesData]);

  const handleCheckboxChange = (amenity) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      [amenity]: prevFormState[amenity] === 1 ? 0 : 1,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosApi.put(
        `bus-owner/update-amenities/${bus}/`,
        {
          bus: bus,
          ...formState,
        }
      );

      if (response.status === 200) {
        console.log("Amenities Updated");
        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          text: "Bus Amenities updated successfully",
        });
      }
      navi("/BusHome/ViewBus");
    } catch (error) {
      console.error("Error updating amenities:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error updating Bus Amenities",
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
          height: "35rem",
          paddingTop: "1rem",
          boxShadow: "5px 5px 30px 0 rgba(29, 108, 177, 0.5)",
        }}
      >
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>
            Update Amenities
          </Card.Title>
          <div style={{ display: "flex",flexDirection:"column" }}>
            <Form onSubmit={handleSubmit}>
              {Object.keys(formState).map((amenity) => (
                <div key={amenity} className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    label ={ amenity.replace(/_/g, ' ').replace(/(^|\s)\S/g, match => match.toUpperCase())}
                    checked={formState[amenity] === 1}
                    onChange={() => handleCheckboxChange(amenity)}
                  />
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "center" }}>
              <Button type="submit" data-testid="bus-type-select">Update Amenities</Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
