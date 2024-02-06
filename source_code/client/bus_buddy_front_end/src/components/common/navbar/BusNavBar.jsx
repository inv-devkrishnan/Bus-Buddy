import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { PersonCircle, BusFrontFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useCallback } from "react";
import { useLogout } from "../../../utils/hooks/useLogout";
import { IoIosNotificationsOutline } from "react-icons/io";
import { axiosApi } from "../../../utils/axiosApi";
import { UserContext } from "../../User/UserContext";
function BusNavBar() {
  const navigate = useNavigate(); // to navigate to different pages
  const logout = useLogout();
  const { firstName} = useContext(UserContext);
  const [user, setUser] = useState({}); // to store current logged user details
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const getUserInfo = useCallback(() => {
    // function to get current user info from localstorage
    let user_name = firstName || localStorage.getItem("user_name");
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
  }, [firstName]);

  const fetchNotifications = async () => {
    try {
      const response = await axiosApi.get("bus-owner/view-notifications/");
      setNotifications(response.data);
      console.log(response.data);
      setNotificationCount(response.data.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  const changenotificationstatus = async () => {
    try {
      await axiosApi.put("bus-owner/change-notification-status/");
    } catch (error) {
      console.error("Error fetching new notifications:", error);
    }
  };
  const getProfile = (role) => {
    // different types of users have different dashboards the bellow function navigates to dashboards based on given role
    switch (role) {
      case "1":
        navigate("/admin-dashboard/view-profile");
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
    if (
      localStorage.getItem("user_role") &&
      localStorage.getItem("user_role") !== "-1"
    ) {
      fetchNotifications(); // Fetch notifications when the component mounts
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [getUserInfo]);

  return (
    <Navbar
      expand="lg"
      bg="primary"
      data-bs-theme="dark"
      fixed="top"
      style={{ zIndex: 99 }}
    >
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
          <Nav className="me-auto">
            <Nav.Link
              onClick={() => {
                navigate("/");
              }}
            >
              Search Trips
            </Nav.Link>
          </Nav>

          <div className="ms-auto d-flex align-items-center">
            {user.role !== "-1" && user.role !== "Guest" && (
              <NavDropdown
                title={
                  <>
                    <IoIosNotificationsOutline
                      className="text-light fw-bold"
                      style={{ fontSize: "24px" }}
                      onClick={changenotificationstatus}
                    />
                    {notificationCount > 0 && (
                      <span
                        className="badge bg-danger rounded-circle"
                        style={{ position: "absolute", top: "0", right: "0" }}
                      >
                        {notificationCount}
                      </span>
                    )}
                  </>
                }
                className="text-light fw-bold"
                data-bs-theme="light"
                id="notifications-dropdown"
              >
                {notifications.length === 0 ? (
                  <NavDropdown.Item>No notifications</NavDropdown.Item>
                ) : (
                  notifications.map((notification) => (
                    <NavDropdown.Item key={notification.id}>
                      {notification.message}
                    </NavDropdown.Item>
                  ))
                )}
              </NavDropdown>
            )}
            <PersonCircle
              className="me-3"
              color="white"
              style={{ marginLeft: "15px", marginRight: "20px" }}
            ></PersonCircle>
            {user.name === "Guest" ? ( // based on the guest or registered user the drop down would change
              <NavDropdown
                title="Hello Guest"
                className="text-light fw-bold"
                data-bs-theme="light"
              >
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
