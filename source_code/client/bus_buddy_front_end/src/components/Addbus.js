import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { BrowserRouter as Router, Route, Switch,Link, Routes } from 'react-router-dom';

export default function Add() {
    const [name,setname]=useState("");
    const [Status,setStatus]=useState("");
    const navi = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();
        try {
          // Send a POST request to add the task
          axios.post("http://localhost:8000/add/", {
            name: name,
            Status: Status,
          });
    
          // After successfully adding the task, navigate to the "Viewalltask" route
          navi('/Viewalltask');
        } catch (error) {
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
         <label for="name">Bus name:</label>
         <input type="text" id="bus_name" name="bus_name" onChange={(e)=>{setname(e.target.value)}}/><br/><br/>
         <label for="Status">User ID:</label>
         <input type="text" id="user" name="user" onChange={(e)=>{setStatus(e.target.value)}}/><br/><br/>
         <label for="Status">Plate No:</label>
         <input type="text" id="plate_no" name="plate_no" onChange={(e)=>{setStatus(e.target.value)}}/><br/><br/>
         <label for="Status">Status:</label>
         <input type="text" id="status" name="status" onChange={(e)=>{setStatus(e.target.value)}}/><br/><br/>
         <label for="Status">Bus Type:</label>
         <input type="text" id="bus_type" name="bus_type" onChange={(e)=>{setStatus(e.target.value)}}/><br/><br/>
         <label for="Status">Bus A/C:</label>
         <input type="text" id="bus_ac" name="bus_ac" onChange={(e)=>{setStatus(e.target.value)}}/><br/><br/>
         <label for="Status">Created date:</label>
         <input type="text" id="created_date" name="created_date" onChange={(e)=>{setStatus(e.target.value)}}/><br/><br/>
         <label for="Status">Updated date:</label>
         <input type="text" id="updated_date" name="updated_date" onChange={(e)=>{setStatus(e.target.value)}}/><br/><br/>
         <input type="submit" value="Add Bus" className="btn btn-success" />
         
      </form> 
          
        </Card.Text>
      </Card.Body>
    </Card>
    </div>
  )
}