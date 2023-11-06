import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import {
  ArrowRight,
  CheckCircleFill,
  XCircleFill,
} from "react-bootstrap-icons";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
function TripCard(props) {
  const [show, setShow] = useState(false); // to show/hide the amenities modal
  const handleClose = () => setShow(false);// function to close amenties modal
  const handleShow = () => setShow(true);// function to show amenties modal

  const formatKey = (key) => {
    // function which takes the key of amenties object and removes underscore and Capitalize the first letter to make it more presentable
    let stringWithSpaces = key.replace(/_/g, " ");
    stringWithSpaces =
      stringWithSpaces.charAt(0).toUpperCase() + stringWithSpaces.slice(1);

    return stringWithSpaces;
  };
  return (
    <Card style={{ width: "60vw" }} className="p-3 mt-3 mb-3">
      <h5 className="text-primary">{props?.data?.company_name}</h5>
      <h6>{props?.data?.bus_name}</h6>
      <div className="d-flex justify-content-between ms-5 me-5">
        <div style={{ textAlign: "center" }}>
          <h6>{props?.startLocationName}</h6>
          <p className="mb-1">{props?.data?.start_location_arrival_time}</p>
          <p className="mb-1">{props?.data?.start_location_arrival_date}</p>
        </div>
        <ArrowRight size={24} />
        <div style={{ textAlign: "center" }}>
          <h6>{props?.endLocationName}</h6>
          <p className="mb-1">{props?.data?.end_location_arrival_time}</p>
          <p className="mb-1">{props?.data?.start_location_arrival_date}</p>
        </div>
        <h5>Travel Fare Starts from : ₹ {props?.data?.travel_fare}</h5>
      </div>
      <div className="w-0 ms-auto">
        <Button className="me-5" size="sm" onClick={handleShow}>
          View Amenities
        </Button>
        <Button size="sm">View Seats</Button>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Bus Amenties</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {Object.entries(props?.data?.amenities).map((amenity) => (
              <ListGroup.Item
                key={amenity.key}
                className="d-flex justify-content-between "
              >
                <p className="text-start m-0">{formatKey(amenity[0])}</p>
                {amenity[1] ? (
                  <XCircleFill color="red" />
                ) : (
                  <CheckCircleFill color="green" />
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}
TripCard.propTypes = {
  data: PropTypes.object,
  startLocationName: PropTypes.string,
  endLocationName: PropTypes.string,
};
export default TripCard;
