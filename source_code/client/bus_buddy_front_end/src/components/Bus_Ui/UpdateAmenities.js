import axios from 'axios';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useLocation } from 'react-router-dom';

export default function Updateamenities() {
    const location = useLocation();
    const bus = location.state;
    console.log(bus.id," : id");
  const [formState, setFormState] = useState({
    emergency_no:0,
    water_bottle: 0,
    charging_point: 0,
    usb_port: 0,
    blankets:0,
    pillows: 0,
    reading_light: 0,
    toilet: 0,
    snacks: 0,
    tour_guide:0,
    cctv:0,
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
      const response = await axios.put(`http://127.0.0.1:8000/Update-Amenities/${bus.id}/`, {
        bus: bus.idstat,
        ...formState,
      });

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
            <div style={{display: 'flex'}}>
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
            </div>
        </Card.Body>
      </Card>
    </div>
  );
}
