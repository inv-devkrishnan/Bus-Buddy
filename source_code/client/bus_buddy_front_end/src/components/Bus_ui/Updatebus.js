import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
export default function Updatebus() {
  const [id,setid]=useState(0);
  const [bus_name,setbus_name]=useState("");
  const [plate_no,setplate_no]=useState("");
  const [bus_type,setbus_type]=useState("");
  const [bus_ac,setbus_ac]=useState("");
  const validated = useState(false);

    const navi = useNavigate();


    // function handleChange(e){
    //   const value=e.target.value;
    //   const name=e.target.name;
    //   setInputs(prevState => ({
    //        ...prevState,[name]:value
    //   }))
    // }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(plate_no < 0 || plate_no > 10){
          alert("Plate Number cannot exceed 10 , pleace remove Spaces in between ")
        }

        try {
          const data = new FormData(e.currentTarget);
          // Send a POST request to add the task
          axios.put(`http://127.0.0.1:8000/updatebus/${id}/`, 
          {
            user:1,
            bus_name:data.get("bus_name"),
            plate_no:data.get("plate_no"),
            bus_type:data.get("bus_type"),
            bus_ac:data.get("bus_ac"),
          } 
          );
          console.log("updated");
          // navi('/Viewalltask');
        } catch (error) {
          console.error("Error updating:", error);
        }
      };

  return (
    <div style={{display:"flex",justifyContent:"right",marginRight:'5rem',paddingTop:'5rem' }}>
            <Card style={{ width: '35rem',height:'30rem',paddingTop:'3rem' }}>
            <Card.Body>
                <Card.Title style={{textAlign:"center"}}>Update Bus</Card.Title>
                <Card.Text style={{display:'flex',}}>
            <Form noValidate validated={validated} onSubmit={handleSubmit} style={{paddingTop:'3rem'}}>
            <Row className="mb-1">
                <Form.Group as={Col} md="3" controlId="validationCustom01">
                <Form.Label>Bus ID</Form.Label>
                <Form.Control
                    required
                    type="text"
                    placeholder="Bus ID"
                    onChange={(e)=>{setid(e.target.value)}}
                />
                </Form.Group>
                </Row>
                <Row className="mb-5">
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
                 <Button type="submit" >Update</Button>
                 </div> 
            </Form>
           
        </Card.Text>
      </Card.Body>
    </Card>
    </div>
  )
}