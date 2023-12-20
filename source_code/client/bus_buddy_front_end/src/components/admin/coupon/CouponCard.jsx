import PropTypes from "prop-types";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";

function CouponCard(props) {
  return (
    <Card className="p-3" style={{ width: "100%" }}>
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
        <div className="d-flex" style={{ maxHeight: "40px" }}>
          <Button className="me-2">View</Button>
          <Button variant="danger" className="me-2">
            Delete
          </Button>
          {props.coupon.status === 0 && (
            <Button variant="warning">Deactivate</Button>
          )}
          {props.coupon.status === 1 && (
            <Button variant="success">Activate</Button>
          )}
        </div>
      </div>
    </Card>
  );
}
CouponCard.propTypes = {
  coupon: PropTypes.object,
};
export default CouponCard;
