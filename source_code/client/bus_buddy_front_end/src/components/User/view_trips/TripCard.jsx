import { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Card, CardBody, Col, Container, Row } from "react-bootstrap";
import {
  ArrowRight,
  CheckCircleFill,
  XCircleFill,
} from "react-bootstrap-icons";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import ViewSeatDetails from "../../../pages/ViewSeatDetails";
import { SeatContext } from "../../../utils/SeatContext";

function TripCard(props) {
  const [show, setShow] = useState(false); // to show/hide the amenities modal
  const handleClose = () => setShow(false); // function to close amenties modal
  const handleShow = () => setShow(true); // function to show amenties modal
  const [viewSeatFlag, setViewSeatFlag] = useState(false); // flag to know if any seat view is open
  const { updateTripID, updateSeatList } = useContext(SeatContext); //

  const formatKey = (key) => {
    // function which takes the key of amenties object and removes underscore and Capitalize the first letter to make it more presentable
    let stringWithSpaces = key.replace(/_/g, " ");
    stringWithSpaces =
      stringWithSpaces.charAt(0).toUpperCase() + stringWithSpaces.slice(1);

    return stringWithSpaces;
  };

  useEffect(() => {
    if (localStorage.getItem("current_trip")) {
      const selectedTrip = JSON.parse(localStorage.getItem("current_trip"));
      if (selectedTrip.data.trip === props.data.trip) {
        props.onClick();
        setViewSeatFlag(true);
        updateTripID(props.data.trip);
        updateSeatList([]);
      }
    }
  }, []);

  const handleSelectSeat = () => {
    localStorage.removeItem("pick_up");
    localStorage.removeItem("drop_off");
    localStorage.removeItem("trip");
    localStorage.removeItem("total_amount");
    localStorage.removeItem("current_trip");
    localStorage.removeItem("seat_list");
    props.onClick();
    setViewSeatFlag(true);
    updateTripID(props.data.trip);
    updateSeatList([]);
  };

  const handleSelectSeatClose = () => {
    localStorage.removeItem("pick_up");
    localStorage.removeItem("drop_off");
    localStorage.removeItem("trip");
    localStorage.removeItem("total_amount");
    localStorage.removeItem("current_trip");
    localStorage.removeItem("seat_list");
    props.onClick();
    setViewSeatFlag(false);
    updateSeatList([]);
  };

  return (
    <>
      <Container>
        <Row>
          <Col md={12} lg={16}>
            <Card className="p-3 mt-3 mb-3" style={{ width: "100%" }}>
              <CardBody>
                <Container>
                  <Row>
                    <Col>
                      <h5 className="text-primary">
                        {props?.data?.company_name}
                      </h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <h6>{props?.data?.bus_name}</h6>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={8} md={3}>
                      <div style={{ textAlign: "center" }}>
                        <h6>{props?.startLocationName}</h6>
                        <p className="mb-1">
                          {props?.data?.start_location_arrival_time}
                        </p>
                        <p className="mb-1">
                          {props?.data?.start_location_arrival_date}
                        </p>
                      </div>
                    </Col>
                    <Col
                      xs={8}
                      md={3}
                      className="d-flex justify-content-center"
                    >
                      <div>
                        <ArrowRight className="ms-4" size={24} />
                        <p>via {props?.data?.via}</p>
                      </div>
                    </Col>
                    <Col xs={8} md={3}>
                      <div style={{ textAlign: "center" }}>
                        <h6>{props?.endLocationName}</h6>
                        <p className="mb-1">
                          {props?.data?.end_location_arrival_time}
                        </p>
                        <p className="mb-1">
                          {props?.data?.end_location_arrival_date}
                        </p>
                      </div>
                    </Col>
                    <Col xs={8} md={3}>
                      <h6>Fare Starts from : ₹ {props?.data?.travel_fare}</h6>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="w-0 ms-auto">
                        <Button
                          className="me-5 mb-1"
                          size="sm"
                          onClick={handleShow}
                        >
                          View Amenities
                        </Button>
                        {viewSeatFlag && props.isOpen ? (
                          <Button size="sm" onClick={handleSelectSeatClose}>
                            Close
                          </Button>
                        ) : (
                          <Button size="sm" onClick={handleSelectSeat}>
                            Select Seats
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Container>
              </CardBody>
              <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Bus Amenties</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <ListGroup>
                    {Object.entries(props?.data?.amenities).map((amenity) => (
                      <ListGroup.Item
                        key={amenity[0]}
                        className="d-flex justify-content-between "
                      >
                        <p className="text-start m-0">
                          {formatKey(amenity[0])}
                        </p>
                        {amenity[1] ? (
                          <CheckCircleFill color="green" />
                        ) : (
                          <XCircleFill color="red" />
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
          </Col>
        </Row>
      </Container>
      <>
        {viewSeatFlag && props.isOpen && (
          <ViewSeatDetails
            currentTrip={props}
            routeCost={props?.data?.route_cost}
            gst={props?.data?.gst}
            startLocation={props?.startLocation}
            endLocation={props?.endLocation}
          />
        )}
      </>
    </>
  );
}
TripCard.propTypes = {
  data: PropTypes.object,
  startLocation: PropTypes.string,
  startLocationName: PropTypes.string,
  endLocation: PropTypes.string,
  endLocationName: PropTypes.string,
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
};
export default TripCard;
