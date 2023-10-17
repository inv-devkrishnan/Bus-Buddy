import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { BrowserRouter as Router, Route, Switch,Link, Routes } from 'react-router-dom';

export default function Updatebus() {
  const [user,setuser]=useState(1);
  const [id,setid]=useState();
  const [start_point,setstart_point]=useState("");
  const [end_point,setend_point]=useState("");
  const [status,setstatus]=useState("");
  const [via,setvia]=useState("");
  const [distance,setdistance]=useState("");
  const [duration,setduration]=useState("");
  const [travel_fare,settravel_fare]=useState("");
  const [validated, setValidated] = useState(false);
  const navi = useNavigate();


    

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
          const data = new FormData(e.currentTarget);
          // Send a POST request to add the task
          axios.put(`http://127.0.0.1:8000/updateroutes/${id}/`, 
          {
            user:user,
            start_point:data.get("start_point"),
            end_point:data.get("end_point"),
            via:data.get("via"),
            distance:data.get("distance"),
            duration:data.get("duration"),
            travel_fare:data.get("travel_fare"),
          }
            
            
          );
          console.log("updated");
          // After successfully adding the task, navigate to the "Viewalltask" route
          // navi('/Viewalltask');
        } catch (error) {
          console.error("Error updating:", error);
        }
      };

  return (
    <div style={{display:"flex",justifyContent:"right",marginRight:'5rem',paddingTop:'5rem' }}>
            <Card style={{ width: '35rem',height:'30rem',paddingTop:'3rem' }}>
            <Card.Body>
                <Card.Title style={{textAlign:"center"}}>Add Route</Card.Title>
                <Card.Text style={{display:'flex',}}>
            <Form noValidate validated={validated} onSubmit={handleSubmit} style={{paddingTop:'3rem'}}>
            <Row className="mb-2">
            <Form.Group as={Col} md="7" controlId="validationCustom01" >
                <Form.Label>Bus ID</Form.Label>
                <Form.Control
                    required
                    type="text"
                    placeholder="Bus ID"
                    onChange={(e)=>{setid(e.target.value)}}
                />
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                <Form.Label>Start Point</Form.Label>
                <Form.Control
                    required
                    type="text"
                    placeholder="strart point"
                    onChange={(e)=>{setstart_point(e.target.value)}}
                />
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                <Form.Label>End Point</Form.Label>
                <Form.Control
                    required
                    type="text"
                    placeholder="end point"
                    onChange={(e)=>{setend_point(e.target.value)}}
                />
                </Form.Group>
            </Row>
            <Row className="mb-5">
            <Form.Group as={Col} md="4" controlId="validationCustomUsername">
                <Form.Label>Via</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="via"
                    required
                    onChange={(e)=>{setvia(e.target.value)}}
                    />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                <Form.Label>Distance</Form.Label>
                <Form.Control type="number" placeholder="distance" required onChange={(e)=>{setdistance(e.target.value)}} />
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="validationCustom04">
                <Form.Label>Duration</Form.Label>
                <Form.Control type="text" placeholder="duration" required onChange={(e)=>{setduration(e.target.value)}}/>
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="validationCustom04">
                <Form.Label>Travel Fare</Form.Label>
                <Form.Control type="number" placeholder="travel_fare" required onChange={(e)=>{settravel_fare(e.target.value)}}/>
                </Form.Group>
            </Row>
            <div style={{paddingTop:'1.5rem'}}>
                 <Button type="submit" >Update</Button>
                 </div> 
            </Form>
           
        </Card.Text>
      </Card.Body>
    </Card>
    </div>
  )
}