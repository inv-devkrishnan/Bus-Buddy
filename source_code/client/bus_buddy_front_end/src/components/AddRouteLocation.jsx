import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";
import { useState } from "react";
function AddRouteLocation(props) {
  const [locationValue, setLocationValue] = useState(1);
  const [arrivalTime, setArrivalTime] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [locationFormValidated, setlocationFormValidated] = useState(false);
  const [location, setLocation] = useState("");

  const [stopName, setStopName] = useState("");
  const [stopArrivalTime, setStopArrivalTime] = useState("");
  const [landmark, setLandmark] = useState("");
  const [stopFormValidated, setStopFormValidated] = useState(false);
  const [stopsArray, setStopsArray] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const checkLocationAlreadyExists = (currentLocationId) => {
    let status = false;
    props.stopLocations.forEach((element) => {
      if (element.location === currentLocationId) {
        status = true;
      }
    });
    return status;
  };
  const locationHandleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      // to handle submissions of locations;

      event.stopPropagation();
      setlocationFormValidated(true);
    } else if (checkLocationAlreadyExists(locationValue)) {
      setErrorMessage("This location is already added");
    }else if(arrivalDate>departureDate)
    {
      setErrorMessage("Arrival date offset can't be past depature date offset");
    }
     else if (arrivalTime > departureTime && arrivalDate === departureDate)
    {
      setErrorMessage("Arrival time can't be past depature time")
    }
     else {
      const locationStop = {
        seq_id: props.sequenceId,
        location: locationValue,
        arrival_time: arrivalTime,
        arrival_date: arrivalDate,
        departure_time: departureTime,
        departure_date: departureDate,
      };

      setLocation(locationStop);
      setLocationValue(1);
      setArrivalTime("");
      setArrivalDate("");
      setDepartureTime("");
      setDepartureDate("");
      setlocationFormValidated(false);
      setErrorMessage("");
      props.setlocationAdded(true);
    }
  };

  const stopHandleSubmit = (event) => {
    // to handle submissions of stops;
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setStopFormValidated(true);
    }else {
      event.preventDefault();
      const newStop = {
        bus_stop: stopName,
        arrival_time: stopArrivalTime,
        landmark: landmark,
        status: 0,
      };
      setStopsArray((stop) => [...stop, newStop]);
      setStopName("");
      setStopArrivalTime("");
      setLandmark("");
      setErrorMessage("");
      console.log(props.sequenceId);
      setStopFormValidated(false);
    }
  };

  const saveDetails = () => {
    if (stopsArray.length > 0) {
      let currentStopLocation = location;
      currentStopLocation["pick_and_drop"] = stopsArray;
      setStopsArray([]); // clears stops array for next location
      props.appendStopLocation(currentStopLocation);
      props.setSequenceId(props.sequenceId + 1);
      props.handleClose();
    } else {
      setErrorMessage("At least add one stop");
    }
  };
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {props.locationAdded ? "Add Stops" : "Add Location"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.locationAdded ? (
          <Form
            noValidate
            validated={stopFormValidated}
            onSubmit={stopHandleSubmit}
          >
            <Form.Group className="mb-3">
              <Form.Label>Stop Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Stop Name"
                value={stopName}
                onChange={(e) => {
                  setStopName(e.target.value);
                }}
                pattern="^[a-zA-Z0-9 ]+$"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide valid Stop Name
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label> Stop Arrival Time</Form.Label>
              <Form.Control
                type="time"
                placeholder="Time"
                value={stopArrivalTime}
                onChange={(e) => {
                  setStopArrivalTime(e.target.value);
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid time.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Landmark</Form.Label>
              <Form.Control
                type="text"
                placeholder="Landmark"
                value={landmark}
                onChange={(e) => {
                  setLandmark(e.target.value);
                }}
                pattern="^[a-zA-Z0-9 ]+$"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a landmark
              </Form.Control.Feedback>
            </Form.Group>
            <label className="text-danger d-block ms-2 me-2">
              {errorMessage}
            </label>
            <Button type="submit" className="ms-2 me-2">
              Add Stop
            </Button>
            <Button
              variant="success"
              onClick={saveDetails}
              className="ms-2 me-2"
            >
              Save
            </Button>
          </Form>
        ) : (
          <Form
            noValidate
            validated={locationFormValidated}
            onSubmit={locationHandleSubmit}
          >
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              {props.locations && (
                <Form.Select
                  aria-label="Default select example"
                  name="ending"
                  value={locationValue}
                  onChange={(e) => {
                    setLocationValue(Number(e.target.value));
                  }}
                >
                  {props.locations.map((location) => (
                    <>
                      <option key={location.id} value={location.id}>
                        {location.location_name}
                      </option>
                    </>
                  ))}
                </Form.Select>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Arrival Time</Form.Label>
              <Form.Control
                type="time"
                placeholder="Enter time"
                value={arrivalTime}
                onChange={(e) => {
                  setArrivalTime(e.target.value);
                }}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Arrival Date offset</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of days"
                min={0}
                max={10}
                value={arrivalDate}
                onChange={(e) => {
                  setArrivalDate(e.target.value);
                }}
                required
              />
              <Form.Text className="text-muted">
                Number of days which is required to reach this location from the start date of the trip
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Departure Time</Form.Label>
              <Form.Control
                type="time"
                placeholder="Enter time"
                value={departureTime}
                onChange={(e) => {
                  setDepartureTime(e.target.value);
                }}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Departure Date offset</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of days"
                min={0}
                max={10}
                value={departureDate}
                onChange={(e) => {
                  setDepartureDate(e.target.value);
                }}
                required
              />
              <Form.Text className="text-muted">
              Number of days after which we leave this location from the start date of the trip
              </Form.Text>
            </Form.Group>
            <label className="text-danger d-block ms-2 me-2">
              {errorMessage}
            </label>
            <Button variant="primary mt-2" type="submit">
              Add Location
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}
export default AddRouteLocation;
