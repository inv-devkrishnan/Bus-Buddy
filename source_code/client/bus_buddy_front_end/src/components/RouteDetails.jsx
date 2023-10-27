import Card from "react-bootstrap/Card";
import { React, useEffect, useState } from "react";
import axios from "axios";
import { Button,Table } from "react-bootstrap";
function RouteDetails(props) {
  const routeData = props.routeData;
  const [locations, setLocations] = useState([]);
  const [showMore,setshowMore] = useState(false);

  const getLocationName = (locationId) => {
    let locationName;
    locations.forEach((element) => {
      if (element.id === locationId) {
        locationName = element.location_name;
      }
    });
    return locationName;
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/get-location-data/")
      .then((res) => {
        setLocations(res.data);
      })
      .catch((err) => {});
  }, []);
  return (
    <Card className="p-3 w-75">
      <Card.Title>
        {getLocationName(routeData.start_point)} To{" "}
        {getLocationName(routeData.end_point)}
      </Card.Title>
      <Card.Text>Via {routeData.via}</Card.Text>
      <div className="d-flex">
        <p className="me-5">
          <span className="fw-bold">Distance : </span>
          {routeData.distance} km
        </p>
        <p className="me-5">
          <span className="fw-bold">Duration : </span>
          {routeData.duration} hrs
        </p>
        <p className="me-5">
          <span className="fw-bold">Travel Fare : ₹</span>
          {routeData.travel_fare}
        </p>
      </div>
      <div>
        <Button className=" me-2" onClick={()=>{showMore?setshowMore(false):setshowMore(true)}}>{showMore?"Show less":"Show more"}</Button>
        <Button className=" me-2" variant="danger">
          Delete
        </Button>
      </div>
      {showMore &&
         <Table>
         <thead>
           <tr>
             <th>S.No</th>
             <th>Location Name</th>
             <th>Stops</th>
           </tr>
         </thead>
           <tbody>
             {routeData.location.map((stopLocation) => (
               <tr key={stopLocation.seq_id}>
                 <td>{stopLocation.seq_id}</td>
                 <td>{getLocationName(stopLocation.location)}</td>
                 <td>
                   <ul>
                     {stopLocation.pick_and_drop.map((stops) => (
                       <li key={stops.bus_stop}>{stops.bus_stop}</li>
                     ))}
                   </ul>
                 </td>
               </tr>
             ))}
           </tbody>
       </Table>
      }
     
    </Card>
  );
}
export default RouteDetails;
