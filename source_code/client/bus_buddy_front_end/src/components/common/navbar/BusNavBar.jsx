import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import { PersonCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
function BusNavBar() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };
  return (
    <Navbar expand="lg" bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand className="fw-bold"> Bus Buddy</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="ms-auto d-flex align-items-center">
            <PersonCircle className="me-3" color="white"></PersonCircle>
            <NavDropdown title="Hello Guest" className="text-light fw-bold">
              <NavDropdown.Item
                onClick={() => {
                  navigateTo("/login");
                }}
              >
                Login
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  navigateTo("/register-user");
                }}
              >
                Register as user
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  navigateTo("/register-owner");
                }}
              >
                Register as bus owner
              </NavDropdown.Item>
            </NavDropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default BusNavBar;
