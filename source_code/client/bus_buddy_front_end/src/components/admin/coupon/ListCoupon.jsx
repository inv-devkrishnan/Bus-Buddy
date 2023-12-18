import { Button, Col, Row } from "react-bootstrap";
import { PlusLg } from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";

function ListCoupon() {
    const navigate = useNavigate();
  return (
    <Container fluid className="ms-2 mt-2" style={{ overflowX: "hidden" }}>
      <Row>
        <Col>
          <h1 className="ms-2">Coupons</h1>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Button variant="success" className="ms-2" onClick={()=>{navigate("/admin-dashboard/create-coupon")}}>
            <PlusLg color="white"></PlusLg> New coupon
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
export default ListCoupon;
