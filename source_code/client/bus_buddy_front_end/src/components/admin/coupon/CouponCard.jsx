import PropTypes from "prop-types";
import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Modal,
  Form,
} from "react-bootstrap";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";

function CouponCard(props) {
  const [showCouponDetails, setShowCouponDetails] = useState(false); // state variable to show/hide coupon details

  const handleClose = () => setShowCouponDetails(false); // function to close coupon details modal
  const handleShow = () => setShowCouponDetails(true); // function to open coupon details modal
  return (
    <Card className="p-3 w-100">
      <Card.Title>{props.coupon.coupon_name}</Card.Title> 
      <Card.Text className="text-secondary">
        Coupon Code :{" "}
        <span className="fw-bold">{props.coupon.coupon_code}</span>
      </Card.Text>
      <div className="d-flex align-items-center">
        <Container>
          <Row>
            <Col>
              <Card.Text>
                <li>
                  Valid till :{" "}
                  <span className="fw-bold">{props.coupon.valid_till}</span>
                </li>
              </Card.Text>
            </Col>
            <Col>
              <Card.Text>
                <li>
                  One Time Use{" "}
                  {props.coupon.one_time_use === 0 && (
                    <CheckCircleFill
                      color="green"
                      className="mb-1"
                    ></CheckCircleFill>
                  )}
                  {props.coupon.one_time_use === 1 && (
                    <XCircleFill color="red" className="mb-1"></XCircleFill>
                  )}
                </li>
              </Card.Text>
            </Col>
            <Col>
              <Card.Text>
                <li>
                  Discount :{" "}
                  <span className="fw-bold">{props.coupon.discount} %</span>
                </li>
              </Card.Text>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className="d-flex justify-content-end">
            <Col xxl={4} xl={5} lg={5} md={12} className="d-flex mb-1">
              <Button
                style={{ width: "117px" }}
                onClick={() => {
                  handleShow();
                }}
              >
                View Details
              </Button>
            </Col>
            <Col xxl={4} xl={5} lg={5} md={12} className="d-flex  mb-1">
              <Button style={{ width: "117px" }} variant="danger">
                Delete
              </Button>
            </Col>
            <Col xxl={4} xl={5} lg={5} md={12} className="d-flex  mb-1">
              {props.coupon.status === 0 && (
                <Button style={{ width: "117px" }} variant="warning">
                  Deactivate
                </Button>
              )}
              {props.coupon.status === 1 && (
                <Button style={{ width: "117px" }} variant="success">
                  Activate
                </Button>
              )}
            </Col>
          </Row>
        </Container>
        <Modal show={showCouponDetails} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Coupon Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>Coupon Description</h6>
            <Form.Control
              as="textarea"
              rows={3}
              required
              value={props.coupon.coupon_description}
              readOnly
              maxLength={500}
            />
            <h6 className="mt-2">Coupon Eligibility</h6>
            <li className="ms-3">
              {props.coupon.coupon_eligibility === 0 && "Everyone"}
              {props.coupon.coupon_eligibility === 1 && "First Booking"}
            </li>
            <h6 className="mt-2">Coupon Availability</h6>
            <li className="ms-3">
              {props.coupon.coupon_availability === 0 && "All Trips"}
              {props.coupon.coupon_availability === 1 &&
                "Only for " + props.coupon?.user?.company_name + " trips"}
              {props.coupon.coupon_availability === 2 &&
                "Only for the trip " +
                  props.coupon?.trip?.route?.start_point?.location_name +
                  " to " +
                  props.coupon?.trip?.route?.end_point?.location_name +
                  " on " +
                  props.coupon?.trip?.start_date}
            </li>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Card>
  );
}
CouponCard.propTypes = {
  coupon: PropTypes.object,
};
export default CouponCard;
