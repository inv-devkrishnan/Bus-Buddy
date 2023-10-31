import axios from 'axios';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function Addbus() {
    const user=useState(1);
    const [start_point,setstart_point]=useState("");
    const [end_point,setend_point]=useState("");
    const [via,setvia]=useState("");
    const [distance,setdistance]=useState("");
    const [duration,setduration]=useState("");
    const [travel_fare,settravel_fare]=useState("");
    const validated = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!start_point || end_point || via ){
          alert("Start Point , End Point and Via  Feilds cannot be Null")
        }
        if(distance<=0 || duration<=0 ){
          alert("Duraction and distance Should not 0")
        }
        try {
          // Send a POST request to add the task
          const response = await axios.post("http://localhost:8000/bus-owner/addroutes/", {
            user:user,
            start_point: start_point,
            end_point:end_point,
            via:via,
            distance:distance,
            duration:duration,
            travel_fare:travel_fare
          });
        
          if (response.status===200){
            console.log("Inserted");
            // After successfully adding the task, navigate to the "Viewalltask" route
            // navi('/Bushome'); 
          }
        } catch (error) {

          console.log({
            user:Number(user),
            start_point: start_point,
            end_point:end_point,
            via:via,
            distance:distance,
            duration:duration,
            travel_fare:travel_fare          })

          console.error("Error adding task:", error);
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
                 <Button type="submit" >Add</Button>
                 </div> 
            </Form>
           
        </Card.Text>
      </Card.Body>
    </Card>
    </div>
  )
}
