import { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
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
  const [startLocationName, setStartLocationName] = useState(""); // to pass the startlocation name  to trip card
  const [endLocationName, setEndLocationName] = useState(""); // to pass the end location name to trip card
  const [tripDate, setTripDate] = useState(); // to store trip date
  
  useEffect(() => {
    getLocationData();
    localStorage.removeItem("pick_up");
    localStorage.removeItem("drop_off");
    localStorage.removeItem("trip");
    localStorage.removeItem("total_amount");
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
    let startlocation = document.getElementById("start_text_box")?.value.trim();

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
        setStartLocationName(startlocation);
        setEndLocationName(endlocation);
        setTripDate(date);
        setEnableSearch(true);
      } else {
        setEnableSearch(false);
      }
    } else {
      setEnableSearch(false);
    }
  };
  const viewTrips = async () => {
    // shows the trips list and hides the splash image
    setShowTripList(true);
  };
  return (
    <>
      <div className=" mt-2 d-flex justify-content-center align-items-center">
        <Card className="p-3">
          <Container>
            <Row>
              {!showTripList && (
                <>
                  <Col md={3}>
                    <Image src={splashscreen} fluid></Image>
                  </Col>
                  <Col className="mt-5" md={4}>
                    <h1>Find your Trip</h1>
                    <h2 className="text-primary mt-3">@ Affordable Prices</h2>
                  </Col>
                </>
              )}
            </Row>

            <Row className="justify-content-end">
              <Col xs={12} md={3}>
                <input
                  className="form-control mb-1"
                  list="datalistOptions"
                  id="start_text_box"
                  onChange={validateSearchTerms}
                  placeholder="from location"
                />
              </Col>
              <Col xs={12} md={3}>
                <input
                  className="form-control  mb-1"
                  list="datalistOptions"
                  id="end_text_box"
                  onChange={validateSearchTerms}
                  placeholder="to location"
                />
              </Col>
              <Col xs={12} md={3}>
                <input
                  className="form-control  mb-1"
                  id="trip_date_picker"
                  type="date"
                  onChange={validateSearchTerms}
                  min={getCurrentDate()}
                />
              </Col>
              <Col xs={12} md={2}>
                <Button
                  disabled={!enableSearch}
                  onClick={() => {
                    viewTrips();
                  }}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </Container>
          <datalist id="datalistOptions">
            {locations.map((location) => (
              <option key={location.id} value={location.location_name}>
                {location.location_name}
              </option>
            ))}
          </datalist>
        </Card>
      </div>
      {showTripList && (
        <ShowTrips
          startLocation={startLocation}
          startLocationName={startLocationName}
          endLocationName={endLocationName}
          endLocation={endLocation}
          tripDate={tripDate}
        />
      )}
    </>
  );
}
export default LandingPage;
