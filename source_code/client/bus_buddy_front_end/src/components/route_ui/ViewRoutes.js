import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom'
import axios from "axios";
import "./table.css";

export default function Viewalltask() {
  const [pageno,setpageno] =useState(1)
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://localhost:8000/View-Routes/${pageno}/`);
      setData(response.data);
    };
    fetchData();
  }, [pageno]);
  

  const next=(event)=>{
    event.preventDefault();
    setpageno(pageno+1);
  };
  
  const prev=(event)=>{
    event.preventDefault();
    pageno>1 && setpageno(pageno-1)
  };

  const renderCards = () => {
    return data.map((viewroutes) => (
      <div className="card" key={viewroutes.id}>
        <h2>Route ID: {viewroutes.id}</h2>
        <p>Start Point: {viewroutes.start_point}</p>
        <p>End Point: {viewroutes.end_point}</p>
        <p>Via: {viewroutes.via}</p>
        <p>Distance: {viewroutes.distance}</p>
        <p>Duration: {viewroutes.duration}</p>
        <p>Travel Fare: {viewroutes.travel_fare}</p>
      </div>
    ));
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",margin:"20px"}}>
        <Link to={'/Addroutes'}>
          <button className="btn btn-primary">Add Routes</button> 
        </Link>  
        <Link to={'/Deleteroutes'}>
          <button className="btn btn-primary">Delete Routes</button> 
        </Link>
      </div>
      <div style={{ textAlign: "center", backgroundColor: "GrayText" }}>
        <h1>Viewall</h1>
      </div>
      <div className="card-container">{renderCards()}</div>
      <div style={{display:"flex",justifyContent:"space-between",margin:"20px"}}>
        <button className="btn btn-primary" onClick={prev}>prev</button> 
        <button className="btn btn-primary" onClick={next} >next</button> 
      </div>
    </div>
  );
}
