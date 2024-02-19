import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Outlet } from "react-router-dom";

function AdminProfile() {
  return (
    <Container className="ms-2 mt-2">
      <Row>
        <Col>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
export default AdminProfile;
