import React, { useEffect, useState } from "react";
import axios from "axios";
import "./table.css";

export default function Viewalltask() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:8000/View-Routes/1/");
      setData(response.data);
    };
    fetchData();
  }, []);

  const renderCards = () => {
    return data.map((viewroutes) => (
      <div className="card" key={viewroutes.id}>
        <h2>Route ID: {viewroutes.id}</h2>
        {/* <p>Start Point: {viewroutes.start_point}</p>
        <p>End Point: {viewroutes.end_point}</p> */}
        <p>Via: {viewroutes.via}</p>
        <p>Distance: {viewroutes.distance}</p>
        <p>Duration: {viewroutes.duration}</p>
        <p>Travel Fare: {viewroutes.travel_fare}</p>
      </div>
    ));
  };

  return (
    <div>
      <div style={{ textAlign: "center", backgroundColor: "GrayText" }}>
        <h1>Viewall</h1>
      </div>
      <div className="card-container">{renderCards()}</div>
    </div>
  );
}
