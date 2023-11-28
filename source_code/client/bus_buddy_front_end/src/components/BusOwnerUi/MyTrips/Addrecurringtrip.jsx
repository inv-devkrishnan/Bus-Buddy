import { React , useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { axiosApi } from "../../../utils/axiosApi";


export default function Addrecurringtrip() {
 const [busData, setBusData] = useState([]);
 const [routeData, setRouteData] = useState([]);
 const [bus, setBus] = useState("");
 const [route, setRoute] = useState("");
 const [selectedStartDate, setSelectedStartDate] = useState(null);
 const [selectedEndDate, setSelectedEndDate] = useState(null);
 const [selectedPeriodStartDate, setSelectedPeriodStartDate] = useState(null);
 const [selectedPeriodEndDate, setSelectedPeriodEndDate] = useState(null);
 const [startTime, setStartTime] = useState("");
 const [endTime, setEndTime] = useState("");
 const [searchMode, setSearchMode] = useState(true);
 const [recurrence,setRecurrence] = useState(0)




 const dates = (selectedPeriodStartDate, selectedPeriodEndDate) => {
  console.log(selectedPeriodStartDate)
   const start = selectedPeriodStartDate
   ? new Date(selectedPeriodStartDate.getTime() - selectedPeriodStartDate.getTimezoneOffset() * 60000)
       .toISOString()
       .split("T")[0]
   : null;

 console.log(selectedPeriodEndDate)
 const end = selectedPeriodEndDate
   ? new Date(selectedPeriodEndDate.getTime() - selectedPeriodEndDate.getTimezoneOffset() * 60000)
       .toISOString()
       .split("T")[0]
   : null;
   // Fetch Bus data
   axiosApi
     .get(`http://127.0.0.1:8000/bus-owner/view-available-bus/?start=${start}&end=${end}`)
     .then((response) => {
       setBusData(response.data);
     })
     .catch((error) => console.error("Error fetching Bus data:", error));


   // Fetch Route data
   axiosApi
     .get("http://127.0.0.1:8000/bus-owner/view-routes/")
     .then((response) => {
       setRouteData(response.data.results);
       setSearchMode(false)
     })
     .catch((error) => console.error("Error fetching Route data:", error));
 };
 console.log(busData);
 console.log(routeData);
 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
       const formattedStartDate = selectedStartDate
       ? new Date(selectedStartDate.getTime() - selectedStartDate.getTimezoneOffset() * 60000)
           .toISOString()
           .split("T")[0]
       : null;


       const formattedEndDate = selectedEndDate
       ? new Date(selectedEndDate.getTime() - selectedEndDate.getTimezoneOffset() * 60000)
           .toISOString()
           .split("T")[0]
       : null;


       const start = selectedPeriodStartDate
       ? new Date(selectedPeriodStartDate.getTime() - selectedPeriodStartDate.getTimezoneOffset() * 60000)
           .toISOString()
           .split("T")[0]
       : null;


       const end = selectedPeriodEndDate
       ? new Date(selectedPeriodEndDate.getTime() - selectedPeriodEndDate.getTimezoneOffset() * 60000)
           .toISOString()
           .split("T")[0]
       : null;

       console.log(start)
       console.log(end)
       const response = await axiosApi.post(
       `http://127.0.0.1:8000/bus-owner/add-reccuring-trip/?start=${start}&end=${end}`,
       {
           bus: bus,
           route: route,
           start_date: formattedStartDate,
           end_date: formattedEndDate,
           start_time: startTime,
           end_time: endTime,
           recurrence: recurrence !== "" ? parseInt(recurrence) : null,
       }
       );
       if (response.status === 200) {
           console.log("Amenities Inserted");
           Swal.fire({
           icon: "success",
           title: "Added Successfully",
           text: "trip added successfully",
           });
       }
   }
   catch (error) {
     console.error("Error adding amenities:", error);
     Swal.fire({
       icon: "error",
       title: "Error",
       text: "Error adding trip",
     });
   }
 };


 return (
   <div
     style={{
       display: "flex",
       justifyContent: "center",
       marginRight: "5rem",
       paddingTop: "2.5rem",
     }}
   >
     <Card
       style={{
         width: "35rem",
         height: "48rem",
         paddingTop: "3rem",
         boxShadow: "5px 5px 30px 0 rgba(29, 108, 177, 0.5)",
       }}
     >
       <Card.Body>
         <Card.Title style={{ textAlign: "center" }}>Add Recurring Trip</Card.Title>
         <div style={{ display: "flex", justifyContent: "space-around" }}>
           <Form onSubmit={handleSubmit} style={{ paddingTop: "1.5rem" }}>
           <p style={{fontSize:"11px"}}>Please select the period that you want your trip to reccur </p>
             <Row className="mb-2">
               <Form.Group as={Col} md="6" controlId="validationCustom02">
                 <Form.Label>Start Date :</Form.Label>
                 <DatePicker
                   selected={selectedPeriodStartDate}
                   onChange={(date) => setSelectedPeriodStartDate(date)}
                   className="form-control"
                   dateFormat="yyyy-MM-dd"
                 />
               </Form.Group>
               <Form.Group as={Col} md="6" controlId="validationCustom02">
                 <Form.Label>End Date:</Form.Label>
                 <DatePicker
                   selected={selectedPeriodEndDate}
                   onChange={(date) => setSelectedPeriodEndDate(date)}
                   className="form-control"
                   dateFormat="yyyy-MM-dd"
                 />
               </Form.Group>
               <div style={{display:"flex",justifyContent:"center"}}>
                 <Button style={{marginTop:"2%",width:"35%",}} type="button" onClick={() => dates(selectedPeriodStartDate, selectedPeriodEndDate)}>search</Button>
               </div>
               <p style={{fontSize:"11px"}}>Press the search button to search for buses available for the dates you have entered</p>
             </Row>
             <Row className="mb-2">
             <Form.Group as={Col} md="6" controlId="validationCustom02">
                 <Form.Label>Start Date :</Form.Label>
                 <DatePicker
                   selected={selectedStartDate}
                   onChange={(date) => setSelectedStartDate(date)}
                   className="form-control"
                   dateFormat="yyyy-MM-dd"
                 />
               </Form.Group>
               <Form.Group as={Col} md="6" controlId="validationCustom02">
                 <Form.Label>End Date:</Form.Label>
                 <DatePicker
                   selected={selectedEndDate}
                   onChange={(date) => setSelectedEndDate(date)}
                   className="form-control"
                   dateFormat="yyyy-MM-dd"
                 />
               </Form.Group>
               <Form.Group as={Col} md="6" controlId="validationCustom01">
                 <Form.Label>Bus</Form.Label>
                 <Form.Control
                   as="select"
                   onChange={(e) => {
                     setBus(e.target.value);
                   }}
                 >
                   <option value="">Select option</option>
                   {busData.map((bus) => (
                     <option key={bus.id} value={bus.id}>
                       {bus.bus_name}
                     </option>
                   ))}
                 </Form.Control>
               </Form.Group>
               <Form.Group as={Col} md="6" controlId="validationCustom03">
                 <Form.Label>Route</Form.Label>
                 <Form.Control
                   as="select"
                   onChange={(e) => {
                     setRoute(e.target.value);
                   }}
                 >
                   <option value="">Select option</option>
                   {routeData.map((route) => (
                     <option key={route.id} value={route.id}>
                       {route.start_point_name} - {route.end_point_name}
                     </option>
                   ))}
                 </Form.Control>
               </Form.Group>
                 <Form.Group className="mb-6">
                   <Form.Label>Arrival Time</Form.Label>
                   <Form.Control
                     type="time"
                     placeholder="Enter time"
                     value={startTime}
                     onChange={(e) => {
                       setStartTime(e.target.value);
                     }}
                     required={searchMode}
                   />
                 </Form.Group>
                 <Form.Group className="mb-5">
                   <Form.Label>Departure Time</Form.Label>
                   <Form.Control
                     type="time"
                     placeholder="Enter time"
                     value={endTime}
                     onChange={(e) => {
                       setEndTime(e.target.value);
                     }}
                     required={searchMode}
                   />
                 </Form.Group>
             <Form.Group as={Col} md="4" controlId="validationCustom04">
                  <Form.Label>Recurrence Type</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setRecurrence(e.target.value)}
                    value={recurrence}
                  >
                    <option value="0">Select option</option>
                    <option value="1"> Daily </option>
                    <option value="2"> Weekly </option>
                  </Form.Control>
                </Form.Group>
                </Row>
             <div
               style={{
                 display: "flex",
                 justifyContent: "center",
               }}
             >
               <Button type="submit">Add</Button>
             </div>
           </Form>
         </div>
       </Card.Body>
     </Card>
   </div>
 );
}



