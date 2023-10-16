import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { BrowserRouter as Router, Route, Switch,Link, Routes } from 'react-router-dom';

export default function Updatebus() {
  const [id,setid]=useState(0);
  const [uid,setuid]=useState(1);
  const [bus_name,setbus_name]=useState("");
  const [plate_no,setplate_no]=useState("");
  const [status,setstatus]=useState("");
  const [bus_type,setbus_type]=useState("");
  const [bus_ac,setbus_ac]=useState("");
  const [inputs,setInputs] = useState({})
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
        try {
          const data = new FormData(e.currentTarget);
          // Send a POST request to add the task
          axios.put(`http://127.0.0.1:8000/updatebus/${id}/`, 
          {
            user:1,
            bus_name:data.get("bus_name"),
            plate_no:data.get("plate_no"),
            status:data.get("status"),
            bus_type:data.get("bus_type"),
            bus_ac:data.get("bus_ac"),
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
         <label for="user">Bus ID:</label>
         <input type="text" id="id" name="id" onChange={(e)=>{setid(e.target.value)}}/><br/><br/>
         <label for="user">User ID:</label>
         <input type="text" id="id" name="id" value={1}/><br/><br/>
         <label for="bus_name">Bus name:</label>
         <input type="text" id="bus_name" name="bus_name"  /><br/><br/>
         <label for="plate_no">Plate No:</label>
         <input type="text" id="plate_no" name="plate_no" /><br/><br/>
         <label for="status">Status:</label>
         <input type="text" id="status" name="status" /><br/><br/>
         <label for="bus_type">Bus Type:</label>
         <input type="text" id="bus_type" name="bus_type"/><br/><br/>
         <label for="bus_ac">Bus A/C:</label>
         <input type="text" id="bus_ac" name="bus_ac"/><br/><br/>
         <button type="submit" className="btn btn-success">Update</button>
        </form> 
        </Card.Text>
      </Card.Body>
    </Card>
    </div>
  )
}