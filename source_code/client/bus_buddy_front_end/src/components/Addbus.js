import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { BrowserRouter as Router, Route, Switch,Link, Routes } from 'react-router-dom';

export default function Addbus() {
    const [user,setuser]=useState("");
    const [bus_name,setbus_name]=useState("");
    const [plate_no,setplate_no]=useState("");
    const [status,setstatus]=useState("");
    const [bus_type,setbus_type]=useState("");
    const [bus_ac,setbus_ac]=useState("");
    const navi = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          // Send a POST request to add the task
          const response = await axios.post("http://localhost:8000/addbus/", {
            user:Number(user),
            bus_name: bus_name,
            plate_no:plate_no,
            status: status,
            bus_type:bus_type,
            bus_ac:bus_ac
          });
        
          if (response.status===200){
            console.log("Inserted");
            // After successfully adding the task, navigate to the "Viewalltask" route
            navi('/Bushome'); 
          }
        } catch (error) {

          console.log({
            user:Number(user),
            bus_name: bus_name,
            plate_no:plate_no,
            status: status,
            bus_type:bus_type,
            bus_ac:bus_ac
          })

          console.error("Error adding task:", error);
        }
      };

  return (
    <div style={{display:"flex",justifyContent:"center"}}>
      <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title style={{textAlign:"center"}}>Add Task</Card.Title>
        <Card.Text style={{display:'flex',}}>
        <form onSubmit={handleSubmit} >
         <label for="user">User ID:</label>
         <input type="number" id="user" name="user" onChange={(e)=>{setuser(e.target.value)}}/><br/><br/>
         <label for="name">Bus name:</label>
         <input type="text" id="bus_name" name="bus_name" onChange={(e)=>{setbus_name(e.target.value)}}/><br/><br/>
         <label for="Status">Plate No:</label>
         <input type="text" id="plate_no" name="plate_no" onChange={(e)=>{setplate_no(e.target.value)}}/><br/><br/>
         <label for="Status">Status:</label>
         <input type="text" id="status" name="status" onChange={(e)=>{setstatus(e.target.value)}}/><br/><br/>
         <label for="Status">Bus Type:</label>
         <input type="text" id="bus_type" name="bus_type" onChange={(e)=>{setbus_type(e.target.value)}}/><br/><br/>
         <label for="Status">Bus A/C:</label>
         <input type="text" id="bus_ac" name="bus_ac" onChange={(e)=>{setbus_ac(e.target.value)}}/><br/><br/>
         <input type="submit" value="Add Bus" className="btn btn-success" />

      </form> 
          
        </Card.Text>
      </Card.Body>
    </Card>
    </div>
  )
}
