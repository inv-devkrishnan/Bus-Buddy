import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
// import { BrowserRouter as Router, Route, Switch,Link, Routes } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function Addbus() {
    const user=useState(1);
    const [bus_name,setbus_name]=useState("");
    const [plate_no,setplate_no]=useState("");
    const [bus_type,setbus_type]=useState("");
    const [bus_ac,setbus_ac]=useState("");
    const validated = useState(false);
    const navi = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!bus_name){
          alert("Bus name cannot be Empty")
        }
        if(!plate_no || plate_no.length > 10){
          alert("Plate Number cannot Exceed 10,Dont leave space in between")
        }
        if(bus_type < 0 || bus_type >2 ){
          alert("Bus type can only be 0:Sleeper,1:Seater,2:Both")
        }
        if(bus_ac < 0 || bus_ac > 2){
          alert("Bus A/C can only be 0:A/C,1:Non A/C")
        }

        try {
          // Send a POST request to add the task
          const response = await axios.post("http://localhost:8000/addbus/", {
            user:user,
            bus_name: bus_name,
            plate_no:plate_no,
            bus_type:bus_type,
            bus_ac:bus_ac
          });
        
          if (response.status===200){
            console.log("Inserted");
            // navi('/Bushome'); 
          }
        } catch (error) {

          console.log({
            user:Number(user),
            bus_name: bus_name,
            plate_no:plate_no,
            bus_type:bus_type,
            bus_ac:bus_ac
          })

          console.error("Error adding task:", error);
        }
      };

  return (
    <div style={{display:"flex",justifyContent:"right",marginRight:'5rem',paddingTop:'5rem' }}>
            <Card style={{ width: '35rem',height:'30rem',paddingTop:'3rem' }}>
            <Card.Body>
                <Card.Title style={{textAlign:"center"}}>Add Bus</Card.Title>
                <Card.Text style={{display:'flex',}}>
            <Form noValidate validated={validated} onSubmit={handleSubmit} style={{paddingTop:'3rem'}}>
            <Row className="mb-2">
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                <Form.Label>Bus Name</Form.Label>
                <Form.Control
                    required
                    type="text"
                    placeholder="Bus name"
                    onChange={(e)=>{setbus_name(e.target.value)}}
                />
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                <Form.Label>Plate Number</Form.Label>
                <Form.Control
                    required
                    type="text"
                    placeholder="Plate Number"
                    onChange={(e)=>{setplate_no(e.target.value)}}
                />
                </Form.Group>
            </Row>
            <Row className="mb-5">
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                <Form.Label>Bus Type</Form.Label>
                <Form.Control type="number" placeholder="2" required onChange={(e)=>{setbus_type(e.target.value)}} />
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="validationCustom04">
                <Form.Label>Bus A/C</Form.Label>
                <Form.Control type="number" placeholder="0" required onChange={(e)=>{setbus_ac(e.target.value)}}/>
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
