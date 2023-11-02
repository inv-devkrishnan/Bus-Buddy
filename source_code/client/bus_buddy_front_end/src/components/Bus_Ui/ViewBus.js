import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios';
import'./table.css';

export default function Viewalltask() {

  const [pageno,setpageno] =useState(1)
  const [data, setData] = useState([])

    useEffect(() => {
      const fetchData = async () => {
        const response = await axios.get(`http://localhost:8000/View-Bus/${pageno}/`);
        setData(response.data);
      }
      fetchData();
    },[pageno]);

    const next=(event)=>{
      event.preventDefault();
      setpageno(pageno+1);
    };
    
    const prev=(event)=>{
      event.preventDefault();
      pageno>1 && setpageno(pageno-1)
    };





    const renderCards = () => {
      return data.map(viewbus => (
        <div className="card" style={{marginBottom:"2%"}} key={viewbus.id}>
          <h2>Bus Name: {viewbus.bus_name}</h2>
          <p>Bus ID: {viewbus.id}</p>
          <p>Plate No: {viewbus.plate_no}</p>
          <p>Bus Type: {viewbus.bus_type}</p>
          <p>Bus A/C: {viewbus.bus_ac}</p>
        </div>
      ));
    };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",margin:"20px"}}>
        <Link to={'/AddBus'}>
          <button className="btn btn-primary">Add Bus</button> 
        </Link>  
        <Link to={'/UpdateBus'}>
          <button className="btn btn-primary">Update Bus</button> 
        </Link>  
        <Link to={'/DeleteBus'}>
          <button className="btn btn-primary">Delete Bus</button> 
        </Link>  
      </div>
      <div style={{ textAlign: "center", backgroundColor: "GrayText" }}>
        <h1>Viewall</h1>
      </div>
      <div className="card-container">
        {renderCards()}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",margin:"20px"}}>
        <button className="btn btn-primary" onClick={prev}>prev</button> 
        <button className="btn btn-primary" onClick={next} >next</button> 
      </div>
    </div>
  )
}