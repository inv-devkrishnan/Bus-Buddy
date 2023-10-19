import { Container, Row, Col } from "react-bootstrap";
import RouteDetails from "./RouteDetails";
function ViewAllRoutes() {
  const routes = [
    {
      id: 1,
      start_point: 6,
      end_point: 2,
      via: "Thrissur",
      distance: "110",
      duration: "12",
      travel_fare: "400",
      status: 0,
      location: [
        {
          seq_id: 1,
          location: 6,
          arrival_time: "10:00",
          arrival_date: "1",
          departure_time: "20:00",
          departure_date: "1",
          pick_and_drop: [
            {
              bus_stop: "fdsf",
              arrival_time: "10:00",
              landmark: "fds",
              status: 0,
            },
          ],
        },
        {
          seq_id: 2,
          location: 2,
          arrival_time: "10:00",
          arrival_date: "0",
          departure_time: "11:00",
          departure_date: "0",
          pick_and_drop: [
            {
              bus_stop: "fd",
              arrival_time: "10:00",
              landmark: "fdsf",
              status: 0,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      start_point: 6,
      end_point: 5,
      via: "Thrissur",
      distance: "110",
      duration: "12",
      travel_fare: "400",
      status: 0,
      location: [
        {
          seq_id: 1,
          location: 6,
          arrival_time: "10:00",
          arrival_date: "1",
          departure_time: "20:00",
          departure_date: "1",
          pick_and_drop: [
            {
              bus_stop: "fdsf",
              arrival_time: "10:00",
              landmark: "fds",
              status: 0,
            },
          ],
        },
        {
          seq_id: 2,
          location: 2,
          arrival_time: "10:00",
          arrival_date: "0",
          departure_time: "11:00",
          departure_date: "0",
          pick_and_drop: [
            {
              bus_stop: "fd",
              arrival_time: "10:00",
              landmark: "fdsf",
              status: 0,
            },
          ],
        },
      ],
    },
  ];
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
            <Col >
              <RouteDetails routeData={routeData} />
            </Col>
          </Row>
        ))}
      </Row>
    </Container>
  );
}
export default ViewAllRoutes;
