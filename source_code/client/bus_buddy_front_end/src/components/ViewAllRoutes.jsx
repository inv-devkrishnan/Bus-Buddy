import { Container, Row, Col } from "react-bootstrap";
import RouteDetails from "./RouteDetails";
import axios from "axios";
import { useEffect, useState } from "react";
function ViewAllRoutes() {
  const [routes, setroutes] = useState([]);
  const getAllRoute = async () => {
    axios.get("http://127.0.0.1:8000/bus-owner/View-Routes/1/").then((result) => {
      setroutes(result.data);
    });
  };
  useEffect(() => {
    getAllRoute();
  }, []);
  return (
    <Container className="mt-3">
      <Row>
        <Col>
          <h1>All Routes</h1>
        </Col>
      </Row>
      <Row>
        {routes.map((routeData) => (
          <Row className="mt-3 mb-3" key={routeData.id}>
            <Col>
              <RouteDetails routeData={routeData} />
            </Col>
          </Row>
        ))}
      </Row>
    </Container>
  );
}
export default ViewAllRoutes;
