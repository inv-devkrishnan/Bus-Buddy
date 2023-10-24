import React, { useEffect, useState } from 'react'
import axios from 'axios';
import'./table.css';

export default function Viewalltask() {

    // const [pageno,setpageno] =useState(1)
    // const url = viewbus/1/
    const [data, setData] = useState([])

    useEffect(() => {
      const fetchData = async () => {
        const response = await axios.get("http://localhost:8000/viewbus/1/");
        setData(response.data);
      }
      fetchData();
    },);




    const renderCards = () => {
      return data.map(viewbus => (
        <div className="card" key={viewbus.id}>
          <h2>Bus Name: {viewbus.bus_name}</h2>
          <p>Bus ID: {viewbus.id}</p>
          <p>Plate No: {viewbus.plate_no}</p>
          <p>Status: {viewbus.bus_type}</p>
          <p>Bus A/C: {viewbus.bus_ac}</p>
        </div>
      ));
    };

  return (
    <div>
      <div style={{ textAlign: "center", backgroundColor: "GrayText" }}>
        <h1>Viewall</h1>
      </div>
      <div className="card-container">
        {renderCards()}
      </div>
    </div>
  )
}