import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { openAxiosApi } from "../utils/axiosApi";
import splashscreen from "../assets/images/landing_splash.jpg";
import ShowTrips from "../components/User/view_trips/ShowTrips";
function LandingPage() {
  const [locations, setLocations] = useState([]); // to store the locations
  const [enableSearch, setEnableSearch] = useState(false); // to enable and disable search button
  const [showTripList, setShowTripList] = useState(false); // to show/hide the TripList
  const [startLocation, setStartLocation] = useState(0); // to store start location id
  const [endLocation, setEndLocation] = useState(0); // to store end location id
  const [tripDate,setTripDate] = useState() // to store trip date
  useEffect(() => {
    getLocationData();
  }, []);

  const getLocationData = async () => {
    // to get location data from db
    await openAxiosApi
      .get("get-location-data/")
      .then((result) => {
        setLocations(result.data);
      })
      .catch(function error() {
        console.log(error);
      });
  };

  const validLocation = (locationName) => {
    // to check wether given location is a location in the location array
    let result = -1;
    locations.forEach((element) => {
      if (element.location_name === locationName) result = element.id;
    });
    return result;
  };

  const getCurrentDate = () => {
    // return currentDate
    let currentDate = new Date().toJSON().slice(0, 10);
    return currentDate;
  };

  const validateSearchTerms = () => {
    // validation for start location , end_location and date_picker
    let startlocation = document
      .getElementById("start_text_box")
      ?.value.trim();

    let endlocation = document.getElementById("end_text_box")?.value.trim();
    let date = document.getElementById("trip_date_picker")?.value;
    if (
      startlocation !== endlocation && 
      startlocation.length !== 0 && 
      endlocation.length !== 0 && 
      date.length !== 0
    ) {
      let start_location_id = validLocation(startlocation); // gets the id of the given start location
      let end_location_id = validLocation(endlocation); // gets the id of the given end location
      if (start_location_id !== -1 && end_location_id !== -1) {
        // if the id's are valid then enable search and store id's in state variable
        setStartLocation(start_location_id);
        setEndLocation(end_location_id);
        setTripDate(date);
        setEnableSearch(true);
      } else {
        setEnableSearch(false);
      }
    } else {
      setEnableSearch(false);
    }
  };
  const viewTrips = async () =>
  {
    setShowTripList(true);

  }
  return (
    <>
     <div className="m-5 d-flex justify-content-center">
      <Card className="p-3" style={{ width: "50rem" }}>
        <div className="d-flex align-items-center">
          <img src={splashscreen} height={300} width={300} alt="splash"></img>
          <div>
            <h1>Find your Trip</h1>
            <h1 className="text-primary mt-3">@ Affordable Prices</h1>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <input
            className="form-control"
            list="datalistOptions"
            id="start_text_box"
            onChange={validateSearchTerms}
            placeholder="Type from location"
          />
          <h5 className="me-3 ms-3">to</h5>
          <input
            className="form-control"
            list="datalistOptions"
            id="end_text_box"
            onChange={validateSearchTerms}
            placeholder="Type to location"
          />
          <input
            className="form-control"
            id="trip_date_picker"
            type="date"
            onChange={validateSearchTerms}
            min={getCurrentDate()}
          />
          <Button className="ms-3" disabled={!enableSearch} onClick={()=>{viewTrips()}}>
            Search
          </Button>
        </div>
        <datalist id="datalistOptions">
          {locations.map((location) => (
            <option key={location.id} value={location.location_name}>
              {location.location_name}
            </option>
          ))}
        </datalist>
      </Card>
    </div>
     {showTripList &&
      <ShowTrips startLocation={startLocation} endLocation={endLocation} tripDate={tripDate}/>
     }
    </>
   
  );
}
export default LandingPage;
