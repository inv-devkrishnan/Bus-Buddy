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




    const renderTable = () => {
        return data.map(viewbus => {
          return (
            <tr>
              <td>{viewbus.id}</td>
              <td>{viewbus.bus_name}</td>
              <td>{viewbus.plate_no}</td>
              <td>{viewbus.bus_type}</td>
              <td>{viewbus.bus_ac}</td>
            </tr>
          )
        })
      }

  return (
    <div>
        <div style={{textAlign:"center",backgroundColor:"GrayText"}}>
            <h1>Viewall</h1>
        </div>
        <div style={{marginLeft:"34%"}}>
            <table style={{width:"50%",backgroundColor:"powderblue"}}>
                <thead>
                    <tr>
                        <th>Bus Id</th>
                        <th>Bus Name</th>
                        <th>Plate No</th>
                        <th>Status</th>
                        <th>Bus Type</th>
                        <th>Bus A/C</th>
                    </tr>
                </thead>
                <tbody>{renderTable()}</tbody>
            </table>
        </div>
    </div>
  )
}