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
import Swal from "sweetalert2";
import ViewSeatDetails from "../../../pages/ViewSeatDetails";
import { SeatContext } from "../../../utils/SeatContext";
import { openAxiosApi } from "../../../utils/axiosApi";
import ReviewCard from "./ReviewCard";
import CustomPaginator from "../../common/paginator/CustomPaginator";
import "../../User/view_trips/trip_card.css";

function TripCard(props) {
  const [showAmenites, setShowAmenites] = useState(false); // to show/hide the amenities modal
  const handleAmenitiesClose = () => setShowAmenites(false); // function to close amenties modal
  const handleAmenitesShow = () => setShowAmenites(true); // function to show amenties modal
  const [showReviews, setShowReviews] = useState(false); // to show/hide the amenities modal
  const handleReviewsClose = () => setShowReviews(false); // function to close amenties modal
  const handleReviewsShow = () => setShowReviews(true); // function to show amenties modal
  const [viewSeatFlag, setViewSeatFlag] = useState(false); // flag to know if any seat view is open
  const { updateTripID, updateSeatList } = useContext(SeatContext); //
  const [reviewList, setReviewList] = useState([]);
  const [totalPages, setTotalPages] = useState(0); // to store total pages
  const [currentPage, setCurrentPage] = useState(1); // to get current page

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const getBusOwnerReviews = async (page = 1) => {
    await openAxiosApi
      .get(`user/view-reviews/?user_id=${props?.data?.bus_owner}&page=${page}`)
      .then((result) => {
        if (result.data?.error_code) {
          Swal.fire({
            title: "Something went wrong !",
            icon: "error",
            text: result.data?.error_message,
          });
        } else {
          console.log(result.data);
          setReviewList(result.data?.reviews);
          setTotalPages(result?.data?.pages);
          setCurrentPage(result?.data?.current_page);
        }
      })
      .catch(function (error) {
        Swal.fire({
          title: "Something went wrong !",
          icon: "error",
          text: "Unkown Error",
        });
        console.log(error);
      });
  };

  const getReviewbyPage = async (page) => {
    await getBusOwnerReviews(page);
    document.getElementById("review-list").scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Container>
        <Row>
          <Col sm={12} md={12} lg={12} xl={12} xxl={12}>
            <Card className="p-3 mt-3 mb-3 w-100">
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
                    <Col xs={12} md={3}>
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
                      xs={12}
                      md={3}
                      className="d-flex justify-content-center"
                    >
                      <div>
                        <ArrowRight className="rotate-arrow" size={24} />
                        <p>via {props?.data?.via}</p>
                      </div>
                    </Col>
                    <Col xs={12} md={3}>
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
                    <Col xs={12} md={3} className="center-fare">
                      <h6>Fare Starts from : ₹ {props?.data?.travel_fare}</h6>
                    </Col>
                  </Row>
                  <Row className="mt-3 d-flex justify-content-center">
                    <Col md={4} lg={3} className="center-div">
                      <Button
                        className="mb-1"
                        size="sm"
                        onClick={handleAmenitesShow}
                        style={{ width: "118px" }}
                      >
                        View Amenities
                      </Button>
                    </Col>
                    <Col md={4} lg={3} className="center-div">
                      {viewSeatFlag && props.isOpen ? (
                        <Button
                          size="sm"
                          className="mb-1"
                          style={{ width: "118px" }}
                          onClick={handleSelectSeatClose}
                        >
                          Close
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="mb-1"
                          style={{ width: "118px" }}
                          onClick={handleSelectSeat}
                        >
                          Select Seats
                        </Button>
                      )}
                    </Col>
                    <Col md={4} lg={3} className="center-div">
                      <Button
                        className="mb-1"
                        size="sm"
                        onClick={async () => {
                          handleReviewsShow();
                          await getBusOwnerReviews();
                        }}
                        style={{ width: "118px" }}
                      >
                        View Reviews
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </CardBody>
              <Modal show={showAmenites} onHide={handleAmenitiesClose} centered>
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
                  <Button variant="secondary" onClick={handleAmenitiesClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal
                show={showReviews}
                onHide={handleReviewsClose}
                size="lg"
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Reviews</Modal.Title>
                </Modal.Header>
                <Modal.Body id="review-list" style={{ overflowY: "scroll", height: "75vh" }}>
                  <Container>
                    <Row>
                      <Col>
                        {reviewList.map((review) => (
                          <ReviewCard
                            key={review.id}
                            review={review}
                          ></ReviewCard>
                        ))}
                      </Col>
                    </Row>
                    <Row >
                      <Col className="d-flex justify-content-center">
                        <CustomPaginator
                          totalPages={totalPages}
                          currentPage={currentPage}
                          viewPage={getReviewbyPage}
                        ></CustomPaginator>
                      </Col>
                    </Row>
                  </Container>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleReviewsClose}>
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
