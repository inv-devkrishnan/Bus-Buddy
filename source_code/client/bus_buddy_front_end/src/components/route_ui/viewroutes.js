import React, { useEffect, useState } from 'react'
import axios from 'axios';
import'./table.css';
export default function Viewalltask() {

    // const [pageno,setpageno] =useState(1)
    // const url = viewbus/1/
    const [data, setData] = useState([])

    useEffect(() => {
      const fetchData = async () => {
        const response = await axios.get("http://localhost:8000/viewroutes/1/");
        setData(response.data);
      }
      fetchData();
    },);




    const renderTable = () => {
        return data.map(viewroutes => {
          return (
            <tr>
              <td>{viewroutes.id}</td>
              <td>{viewroutes.start_point}</td>
              <td>{viewroutes.end_point}</td>
              <td>{viewroutes.via}</td>
              <td>{viewroutes.distance}</td>
              <td>{viewroutes.duration}</td>
              <td>{viewroutes.travel_fare}</td>

            </tr>
          )
        })
      }

  return (
    <div>
        <div style={{textAlign:"center",backgroundColor:"GrayText"}}>
            <h1>Viewall</h1>
        </div>
        <div style={{display:'flex',justifyContent:'center'}}>
            <table style={{width:"50%",backgroundColor:"powderblue"}}>
                <thead>
                    <tr>
                        <th>Route ID</th>
                        <th>Start Point</th>
                        <th>End Point</th>
                        <th>Via</th>
                        <th>Distance</th>
                        <th>Duration</th>
                        <th>Travel Fare</th>
                    </tr>
                </thead>
                <tbody>{renderTable()}</tbody>
            </table>
        </div>
    </div>
  )
}