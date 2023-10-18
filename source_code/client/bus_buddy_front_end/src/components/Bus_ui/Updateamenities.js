import axios from 'axios';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useLocation } from 'react-router-dom';

export default function Updateamenities() {
    const location = useLocation();
    const { bus } = location.state;


  const [formState, setFormState] = useState({
    emergency_no: bus.emergency_no,
    water_bottle: bus.water_bottle,
    charging_point: bus.charging_point,
    usb_port: bus.usb_port,
    blankets: bus.blankets,
    pillows: bus.pillows,
    reading_light: bus.reading_light,
    toilet: bus.toilet,
    snacks: bus.snacks,
    tour_guide: bus.tour_guide,
    cctv: bus.cctv,
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
      // Send a PUT request to update the amenities
      const response = await axios.put(`http://localhost:8000/updateamenities/${bus.id}/`, formState);

      if (response.status === 200) {
        console.log('Amenities Updated');
      }
    } catch (error) {
      console.error('Error updating amenities:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'right', marginRight: '5rem', paddingTop: '3rem' }}>
      <Card style={{ width: '35rem', height: '35rem', paddingTop: '1rem' }}>
        <Card.Body>
          <Card.Title style={{ textAlign: 'center' }}>Update Amenities</Card.Title>
          <Card.Text style={{ display: 'flex' }}>
            <Form onSubmit={handleSubmit}>
              {Object.keys(formState).map((amenity) => (
                <div key={amenity} className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    label={amenity}
                    checked={formState[amenity] === 1}
                    onChange={() => handleCheckboxChange(amenity)}
                  />
                </div>
              ))}
              <Button type="submit">Update Amenities</Button>
            </Form>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
