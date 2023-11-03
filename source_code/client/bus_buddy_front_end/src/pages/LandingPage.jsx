import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { openAxiosApi } from "../utils/axiosApi";
import splashscreen from "../assets/images/landing_splash.jpg";
function LandingPage() {
  const [locations, setLocations] = useState([]); // to store the locations
  const [enableSearch, setEnableSearch] = useState(false); // to enable and disable search button
  const [showTripList, setShowTripList] = useState(false); // to show/hide the TripList
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
    let start_location = document
      .getElementById("start_text_box")
      ?.value.trim();

    let end_location = document.getElementById("end_text_box")?.value.trim();
    let trip_date = document.getElementById("trip_date_picker")?.value;
    if (
      start_location !== end_location && // start and stop location cannot be same
      start_location.length !== 0 && // start location can't be empty
      end_location.length !== 0 && // stop location can't be empty
      trip_date.length !== 0 // trip date can't be empty
    ) {
      let start_location_id = validLocation(start_location);
      let end_location_id = validLocation(end_location);
      if (start_location_id !== -1 && end_location_id !== -1) {
        setEnableSearch(true);
      } else {
        setEnableSearch(false);
      }
    } else {
      setEnableSearch(false);
    }
  };

  return (
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
            placeholder="Type start location"
          />
          <h5 className="me-3 ms-3">to</h5>
          <input
            className="form-control"
            list="datalistOptions"
            id="end_text_box"
            onChange={validateSearchTerms}
            placeholder="Type end location"
          />
          <input
            className="form-control"
            id="trip_date_picker"
            type="date"
            onChange={validateSearchTerms}
            min={getCurrentDate()}
          />
          <Button className="ms-3" disabled={!enableSearch}>
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
  );
}
export default LandingPage;
