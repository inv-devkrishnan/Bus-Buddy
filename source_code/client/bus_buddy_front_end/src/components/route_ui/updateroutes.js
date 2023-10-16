import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { BrowserRouter as Router, Route, Switch,Link, Routes } from 'react-router-dom';

export default function Updatebus() {
  const [id,setid]=useState(0);
  const [user,setuser]=useState(1);
  const [bus_name,setbus_name]=useState("");
  const [plate_no,setplate_no]=useState("");
  const [status,setstatus]=useState("");
  const [bus_type,setbus_type]=useState("");
  const [bus_ac,setbus_ac]=useState("");
  const [inputs,setInputs] = useState({})
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
    <div style={{display:"flex",justifyContent:"center"}}>
      <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title style={{textAlign:"center"}}>Update Bus Details</Card.Title>
        <Card.Text style={{display:'flex',}}>
        <form onSubmit={handleSubmit} >
        <label for="user">Route Id:</label>
         <input type="text" id="id" name="id" onChange={(e)=>{setid(e.target.value)}}/><br/><br/>
         <label for="user">Start Point:</label>
         <input type="text" id="start_point" name="start_point" /><br/><br/>
         <label for="bus_name">End Point</label>
         <input type="text" end_point="end_point" name="end_point"  /><br/><br/>
         <label for="plate_no">Via:</label>
         <input type="text" id="via" name="via" /><br/><br/>
         <label for="status">Distance:</label>
         <input type="text" id="distance" name="distance" /><br/><br/>
         <label for="bus_type">Duration:</label>
         <input type="text" id="duration" name="duration"/><br/><br/>
         <label for="bus_ac">Travel Fare:</label>
         <input type="text" id="travel_fare" name="travel_fare"/><br/><br/>
         <button type="submit" className="btn btn-success">Update</button>
        </form> 
        </Card.Text>
      </Card.Body>
    </Card>
    </div>
  )
}