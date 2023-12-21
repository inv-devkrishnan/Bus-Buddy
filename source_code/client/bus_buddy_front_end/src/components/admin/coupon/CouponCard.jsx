import PropTypes from "prop-types";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";

function CouponCard(props) {
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
            <Col
              xxl={4}
              xl={5}
              lg={5}
              md={12}
              className="d-flex justify-content-center mb-1"
            >
              <Button style={{width:"117px"}}>View Details</Button>
            </Col>
            <Col
             xxl={4}
             xl={5}
             lg={5}
             md={12}
              className="d-flex justify-content-center  mb-1"
            >
              <Button style={{width:"117px"}} variant="danger">Delete</Button>
            </Col>
            <Col
               xxl={4}
               xl={5}
               lg={5}
               md={12}
              className="d-flex justify-content-center  mb-1"
            >
              {props.coupon.status === 0 && (
                <Button style={{width:"117px"}} variant="warning">Deactivate</Button>
              )}
              {props.coupon.status === 1 && (
                <Button  style={{width:"117px"}}  variant="success">Activate</Button>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </Card>
  );
}
CouponCard.propTypes = {
  coupon: PropTypes.object,
};
export default CouponCard;
