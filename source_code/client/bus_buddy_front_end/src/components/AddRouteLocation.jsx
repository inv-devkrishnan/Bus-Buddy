import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useState, useEffect } from "react";
import "../index.css";
function AddRouteLocation(props) {
  const [locationValue, setLocationValue] = useState(1);
  const [arrivalTime, setArrivalTime] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [locationFormValidated, setLocationFormValidated] = useState(false);
  const [location, setLocation] = useState("");
  const [isNextDay, setIsNextDay] = useState(false);

  const [stopName, setStopName] = useState("");
  const [stopArrivalTime, setStopArrivalTime] = useState("");
  const [landmark, setLandmark] = useState("");
  const [stopFormValidated, setStopFormValidated] = useState(false);
  const [stopsArray, setStopsArray] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // if user added the location but not the stops the location info is loaded to form
    if (localStorage.getItem("locationStop") !== null) {
      let locationStop = JSON.parse(localStorage.getItem("locationStop"));
      setLocationValue(locationStop.location);
      setArrivalTime(locationStop.arrival_time);
      setArrivalDate(locationStop.arrival_date);
      setDepartureTime(locationStop.departure_time);
      setDepartureDate(locationStop.departure_date);
    }
  }, []);

  const checkLocationAlreadyExists = (currentLocationId) => {
    // function to check if location Already Exists
    let status = false;
    props.stopLocations.forEach((element) => {
      if (element.location === currentLocationId) {
        status = true;
      }
    });
    return status;
  };
  const checkInBetweenStopsSameDay = () => {
    let status = true;

    if (stopsArray.length > 0) {
      // if there are previous stops

      let previous_stop = stopsArray[stopsArray.length - 1]; // get the latest previous stop
      if (previous_stop.arrival_time >= stopArrivalTime) {
        // if previous stop time is greater than current stop
        status = false;
        setErrorMessage(
          "Stop arrival time should be greater than " +
            previous_stop.arrival_time
        );
      }
    }

    return status;
  };

  const checkInBetweenStopsDifferentDay = () => {
    let status = true;
    if (stopsArray.length > 0) {
      // if there are previous stops

      let previous_stop = stopsArray[stopsArray.length - 1]; // get the latest previous stop
      if (previous_stop.arrival_time >= stopArrivalTime) {
        // if previouse stop time is greater than current stop time
        if (stopArrivalTime < departureTime && !isNextDay) {
          // if the previous stop is on current day not next day and current stop is on next day
          setIsNextDay(true); // now its next day
        } else {
          // show error message
          status = false;
          setErrorMessage(
            "Stop arrival time should be greater than " +
              previous_stop.arrival_time
          );
        }
      }
    }
    return status;
  };

  const checkPreviousLocationTime = () => {
    if (props.stopLocations.length > 0) {
      let previousStopLocation =
        props.stopLocations[props.stopLocations.length - 1];
      if (previousStopLocation.departure_date_offset === arrivalDate) {
        // if previous location and current location is reached on same day
        if (previousStopLocation.departure_time < arrivalTime) return true;
        else
          setErrorMessage(
            "Arrival time of this location should be greater than previous location departure time"
          );
        return false;
      } else if (previousStopLocation.departure_date_offset > arrivalDate) {
        setErrorMessage(
          "Arrival Date offset can't be less than previous departure date offset"
        );
        return false;
      } else return true;
    } else return true;
  };
  const checkStopLocationTime = () => {
    let status = true;
    if (arrivalDate === departureDate) {
      // if bus arrive and leave on same date
      if (stopArrivalTime > arrivalTime && stopArrivalTime < departureTime) {
        // if stop time is between arrival time and departure time of location
        status = checkInBetweenStopsSameDay();
      } else {
        status = false;
        setErrorMessage(
          "Stop arrival time should be between " +
            arrivalTime +
            " and " +
            departureTime
        );
      }
    } else if (
      (stopArrivalTime > arrivalTime && stopArrivalTime < Date("00:00")) ||
      stopArrivalTime < departureTime
    ) {
      status = checkInBetweenStopsDifferentDay();
    } else {
      status = false;
      setErrorMessage(
        "Stop arrival time should be between " +
          arrivalTime +
          " of current day and " +
          departureTime +
          " of next day"
      );
    }

    return status;
  };
  const locationHandleSubmit = (event) => {
    // function  to submit a location
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      // to handle submissions of locations;

      event.stopPropagation();
      setLocationFormValidated(true);
    } else if (checkLocationAlreadyExists(locationValue)) {
      setErrorMessage("This location is already added");
    } else if (props.stopLocations.length === 0 && arrivalDate !== "0") {
      setErrorMessage("Arrival date offset should be 0 for the first Location");
    } else if (arrivalDate > departureDate) {
      setErrorMessage("Arrival date offset can't be past depature date offset");
    } else if (arrivalTime > departureTime && arrivalDate === departureDate) {
      setErrorMessage("Arrival time can't be past depature time");
    } else if (departureDate - arrivalDate >= 2) {
      setErrorMessage(
        "Arrival date offset and departure date offset difference should not be greater than 1"
      );
    } else if (checkPreviousLocationTime()) {
      const locationStop = {
        seq_id: props.sequenceId,
        location: locationValue,
        arrival_time: arrivalTime,
        arrival_date_offset: arrivalDate,
        departure_time: departureTime,
        departure_date_offset: departureDate,
      };

      setLocation(locationStop);
      localStorage.setItem("locationStop", JSON.stringify(locationStop));
      setLocationValue(1);
      setLocationFormValidated(false);
      setErrorMessage("");
      // this will enable adding the stops
      props.setlocationAdded(true);
    }
  };

  const stopHandleSubmit = (event) => {
    // to handle submissions of stops;
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setStopFormValidated(true);
    } else if (checkStopLocationTime()) {
      event.preventDefault();
      const newStop = {
        bus_stop: stopName,
        location: locationValue,
        arrival_time: stopArrivalTime,
        landmark: landmark,
        status: 0,
      };
      setStopsArray((stop) => [...stop, newStop]);
      setStopName("");
      setStopArrivalTime("");
      setLandmark("");
      setErrorMessage("");
      setStopFormValidated(false);
    }
  };

  const saveDetails = () => {
    // function to save locations along to with its stops
    if (stopsArray.length > 0) {
      let currentStopLocation = location;
      currentStopLocation["pick_and_drop"] = stopsArray;
      setStopsArray([]); // clears stops array for next location
      props.appendStopLocation(currentStopLocation);
      props.setSequenceId(props.sequenceId + 1);
      localStorage.removeItem("locationStop");
      setErrorMessage("");
      onClose();
    } else {
      setErrorMessage("At least add one stop");
    }
  };
  const onClose = () => {
    setStopName("");
    setArrivalTime("");
    setStopArrivalTime("");
    setArrivalDate("");
    setDepartureDate("");
    setLandmark("");
    setDepartureTime("");
    setErrorMessage("");
    setStopsArray([]);
    setIsNextDay(false);
    setLocationFormValidated(false);
    setStopFormValidated(false);
    props.handleClose();
  };
  return (
    <Modal
      show={props.show}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>
          {props.locationAdded ? "Add Stops" : "Add Location"}
        </Modal.Title>
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip id="closeButtonTooltip">Close</Tooltip>}
        >
          <Button variant="close" onClick={onClose} />
        </OverlayTrigger>
      </Modal.Header>
      <Modal.Body>
        {props.locationAdded ? (
            <Form
              noValidate
              validated={stopFormValidated}
              onSubmit={stopHandleSubmit}
            >
              <Form.Text>
                Add stops for the location.Once done save the changes{" "}
              </Form.Text>
              <Form.Group className="mb-3">
                <Form.Label>Stop Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Stop Name"
                  maxLength={100}
                  value={stopName}
                  onChange={(e) => {
                    setStopName(e.target.value);
                  }}
                  pattern="^(?=.*[a-zA-Z])[a-zA-Z0-9 ]+$"
                  className="remove-bootstrap-form-color"
                  required
                />
                <Form.Control.Feedback type="invalid">
                Please provide a landmark (one or more alphabetic character ,
                  only allows alphabets and numbers)
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label> Stop Arrival Time</Form.Label>
                <Form.Control
                  type="time"
                  placeholder="Time"
                  value={stopArrivalTime}
                  data-testid="stop-time"
                  className="remove-bootstrap-form-color"
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
                  maxLength={100}
                  value={landmark}
                  className="remove-bootstrap-form-color"
                  onChange={(e) => {
                    setLandmark(e.target.value);
                  }}
                  pattern="^(?=.*[a-zA-Z])[a-zA-Z0-9 ]+$"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a landmark (one or more alphabetic character ,
                  only allows alphabets and numbers)
                </Form.Control.Feedback>
              </Form.Group>
              <label className="text-danger d-block ms-2 me-2">
                {errorMessage}
              </label>
           
            <div className="d-flex justify-content-end">
              <Button type="submit" className="ms-2 mt-2 me-2">
                Add Stop
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  saveDetails();
                }}
                className="mt-2 ms-auto"
              >
                Save Changes
              </Button>
            </div>
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
                    <option key={location.id} value={location.id}>
                      {location.location_name}
                    </option>
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
                data-testid="arrival-time"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid time
              </Form.Control.Feedback>
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
                data-testid="arrival-date-offset"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a integer between 0 and 10
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Number of days which is required to reach this location from the
                start date of the trip.(difference of trip start date and
                location arrival date)
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
                data-testid="depature-time"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid time
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Departure Date offset</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of days"
                min={0}
                max={10}
                value={departureDate}
                data-testid="depature-date-offset"
                onChange={(e) => {
                  setDepartureDate(e.target.value);
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a integer between 0 and 10
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Number of days after which we leave this location from the start
                date of the trip.(difference of trip start date and location
                depature date)
              </Form.Text>
            </Form.Group>
            <label className="text-danger d-block ms-2 me-2">
              {errorMessage}
            </label>
            <Button
              variant="primary mt-2"
              type="submit"
              data-testid="add-location-box"
            >
              Add Location
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}
AddRouteLocation.propTypes = {
  stopLocations: PropTypes.array,
  handleClose: PropTypes.func,
  locations: PropTypes.array,
  appendStopLocation: PropTypes.func,
  setSequenceId: PropTypes.func,
  setlocationAdded: PropTypes.func,
  locationAdded: PropTypes.bool,
  sequenceId: PropTypes.number,
  show: PropTypes.bool,
};
export default AddRouteLocation;
