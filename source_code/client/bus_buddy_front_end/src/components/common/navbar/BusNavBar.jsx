import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import { PersonCircle,BusFrontFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLogout } from "../../../utils/hooks/useLogout";
function BusNavBar() {
  const navigate = useNavigate(); // to navigate to different pages
  const logout = useLogout();
  const [user, setUser] = useState({}); // to store current logged user details
  const getUserInfo = () => {
    // function to get current user info from localstorage
    let user_name = localStorage.getItem("user_name");
    let user_role = localStorage.getItem("user_role");
    let user = {};
    if (user_name && user_role) {
      // if user is logged in store name and role to user object
      user["name"] = user_name;
      user["role"] = user_role;
    } else {
      // else store user name as Guest and role as -1
      user["name"] = "Guest";
      user["role"] = "-1";
    }
    console.log(user);
    setUser(user);
  };

  const getProfile = (role) => {
    // different types of users have different dashboards the bellow function navigates to dashboards based on given role
    switch (role) {
      case "1":
        navigate("/admin-dashboard");
        break;
      case "2":
        navigate("/user-dashboard");
        break;
      case "3":
        navigate("/BusHome");
        break;
      default:
        console.log("invalid role");
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <Navbar expand="lg" bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand
          className="fw-bold"
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/");
          }}
        >
          <BusFrontFill className="me-2"></BusFrontFill>
          Bus Buddy
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="ms-auto d-flex align-items-center">
            <PersonCircle className="me-3" color="white"></PersonCircle>
            {user.name === "Guest" ? ( // based on the guest or registered user the drop down would change
              <NavDropdown title="Hello Guest" className="text-light fw-bold" data-bs-theme="light">
                <NavDropdown.Item
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Login
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => {
                    navigate("/register-user");
                  }}
                >
                  Register as user
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => {
                    navigate("/register-owner");
                  }}
                >
                  Register as bus owner
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown
                title={"Hello " + user.name}
                className="text-light fw-bold"
                data-bs-theme="light"
              >
                <NavDropdown.Item
                  onClick={() => {
                    getProfile(user.role);
                  }}
                >
                  View Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default BusNavBar;
