import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function Addbus() {
  const user = useState(1);
  const [bus_name, setBusName] = useState('');
  const [plate_no, setPlateNo] = useState('');
  const [bus_type, setBusType] = useState('');
  const [bus_ac, setBusAC] = useState('');
  const busTypes = ['0', '1', '2']; 
  const busACOptions = ['0', '1'];
  const navi = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bus_name) {
      alert('Bus name cannot be empty');
    }
    if (!plate_no || plate_no.length > 10) {
      alert('Plate Number cannot exceed 10, and don’t leave spaces in between');
    }
    if (bus_type < 0 || bus_type > 2) {
      alert('Bus type can only be 0: Sleeper, 1: Seater, 2: Both');
    }
    if (bus_ac < 0 || bus_ac > 2) {
      alert('Bus A/C can only be 0: A/C, 1: Non A/C');
    }

    try {
      const response = await axios.post('http://localhost:8000/addbus/', {
        user: 1,
        bus_name: bus_name,
        plate_no: plate_no,
        bus_type: bus_type,
        bus_ac: bus_ac,
      });

      if (response.status === 200) {
        console.log("Inserted");
        console.log(response);
        const data = { bus: response.data.bus };
        console.log(data)
        navi('/Addamenities', { state: data });
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'right', marginRight: '5rem', paddingTop: '5rem' }}>
      <Card style={{ width: '35rem', height: '30rem', paddingTop: '3rem' }}>
        <Card.Body>
          <Card.Title style={{ textAlign: 'center' }}>Add Bus</Card.Title>
          <div style={{ display: 'flex' }}>
            <Form  onSubmit={handleSubmit} style={{ paddingTop: '3rem' }}>
              <Row className="mb-2">
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                  <Form.Label>Bus Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Bus name"
                    onChange={(e) => {
                      setBusName(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                  <Form.Label>Plate Number</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Plate Number"
                    onChange={(e) => {
                      setPlateNo(e.target.value);
                    }}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-5">
              <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Bus Type</Form.Label>
                  <Form.Control as="select" onChange={(e) => setBusType(e.target.value)} value={bus_type}>
                    <option value="">Select a bus type</option>
                    {busTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="validationCustom04">
                  <Form.Label>Bus A/C</Form.Label>
                  <Form.Control as="select" onChange={(e) => setBusAC(e.target.value)} value={bus_ac}>
                    <option value="">Select an A/C option</option>
                    {busACOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Row>
              <div style={{ paddingTop: '1.5rem' }}>
                <Button type="submit">Add</Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
