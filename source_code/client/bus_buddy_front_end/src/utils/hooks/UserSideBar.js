import { useLogout } from "../../utils/hooks/useLogout";
import "./UserSideBar.css";
import ListGroup from "react-bootstrap/ListGroup";

function UserSideBar(props) {
  const logout = useLogout()

  return (
    <div className="sidebar">
      <div className="header">
        <h2 className="text-light text-center pt-3">User Name</h2>
      </div>
      <ListGroup>
        <ListGroup.Item>
          <p
            style={
              props.myProfileSelect
                ? { color: "#0275D8", fontWeight: "bold" }
                : { color: "black" }
            }
            onClick={props.myProfileSelected}
          >
           My Profile
          </p>
        </ListGroup.Item>
        <ListGroup.Item>
          <p
            style={
              props.myBusSelect
                ? { color: "#0275D8", fontWeight: "bold" }
                : { color: "black" }
            }
            onClick={props.myBusSelected}
          >
            My Bus
          </p>
        </ListGroup.Item>
        <ListGroup.Item>
          <p
            style={
              props.myRouteSelect
                ? { color: "#0275D8", fontWeight: "bold" }
                : { color: "black" }
            }
            onClick={props.myRouteSelected}
          >
            My Routes
          </p>
        </ListGroup.Item><ListGroup.Item>
          <p
            style={
              props.myTripSelect
                ? { color: "#0275D8", fontWeight: "bold" }
                : { color: "black" }
            }
            onClick={props.myTripSelected}
          >
            My Trips
          </p>
        </ListGroup.Item>
        <ListGroup.Item>
          <p className="text-danger" onClick={logout}>Log Out</p>
        </ListGroup.Item>
        <ListGroup.Item>
          <p className="text-danger" onClick={props.deleteSelected}>Delete Account</p>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}
export default UserSideBar;