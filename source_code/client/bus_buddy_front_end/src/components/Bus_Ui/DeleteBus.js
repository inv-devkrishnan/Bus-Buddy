import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Swal from 'sweetalert2'

export default function Delete() {
  const user=useState(1);
  const [id,setid]=useState();
  const navi = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!id){
      alert("ID cannot be blank")
    }

    axios.put(`http://127.0.0.1:8000/Delete-Bus/${id}/`)
      .then(response => {
        console.log("user:", user);

        console.log("bus deleted successfuly");
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Bus Deleted successfully',
        })
      })
      .catch(error => {
        if (error.response) {
          console.log("HTTP status code:", error.response.status);
          
        } else {
          console.error("An error occurred:", error.message);
          
        };
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error Deleting Bus',
        })
    });
  }

  return (

    
    <div style={{display:"flex",justifyContent:"right",marginRight:'5rem',paddingTop:'5rem' }}>
            <Card style={{ width: '35rem',height:'30rem',paddingTop:'3rem' }}>
            <Card.Body>
                <Card.Title style={{textAlign:"center"}}>Delete Bus</Card.Title>
                <div style={{display:'flex',}} >
            <Form onSubmit={handleSubmit} style={{paddingTop:'3rem'}}>
            <Row className="mb-1">
                <Form.Group as={Col} md="7" controlId="validationCustom01" >
                <Form.Label>Bus ID</Form.Label>
                <Form.Control
                    required
                    type="text"
                    placeholder="Bus ID"
                    onChange={(e)=>{setid(e.target.value)}}
                />
                </Form.Group>
               
            </Row>
            <div style={{paddingTop:'1.5rem'}}>
                 <Button type="submit" >Delete</Button>
                 </div> 
            </Form>
           
        </div>
      </Card.Body>
    </Card>
    </div>
  )
}