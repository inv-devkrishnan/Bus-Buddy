import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function Delete() {
  const [user,setuser]=useState(0);
  const navi = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://127.0.0.1:8000/deletebus/6/`)
      .then(response => {
        // navi('/Viewalltask');
        console.log("user:", user);

        console.log("bus deleted successfuly");
      })
      .catch(error => {
        if (error.response) {
          console.log("HTTP status code:", error.response.status);
          
        } else {
          console.error("An error occurred:", error.message);
          
        };
    });
  }

  return (

    
    <div style={{display:"flex",justifyContent:"center"}}>
      <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title  style={{textAlign:"center"}}>Card Title</Card.Title>
        <Card.Text>
        <form >
         <label for="id"> User ID:</label>
         <input type="number" id="user" name="user" onChange={(e)=>{setuser(e.target.value)}}/><br/><br/>
         <input type='button' value={"Close"} onClick={handleSubmit} className="btn btn-success"/>
      </form> 
        </Card.Text>
      </Card.Body>
    </Card>
    </div>
  )
}