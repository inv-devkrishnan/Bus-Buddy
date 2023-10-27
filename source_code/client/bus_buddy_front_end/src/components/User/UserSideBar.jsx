import { useLogout } from "../../utils/hooks/useLogout";
import "./UserSideBar.css";
import ListGroup from "react-bootstrap/ListGroup";
import DeleteAccount from "../../pages/DeleteAccount";

function UserSideBar(props) {
  return (
    <div className="sidebar">
      <div className="header">
        <h2 className="text-light text-center pt-3">User Name</h2>
      </div>
      <ListGroup>
        <ListGroup.Item>
          <p
            style={
              props.profileSelect
                ? { color: "#0275D8", fontWeight: "bold" }
                : { color: "black" }
            }
            onClick={props.profileSelected}
          >
           My Profile
          </p>
        </ListGroup.Item>
        <ListGroup.Item>
          <p
            style={
              props.listUserSelect
                ? { color: "#0275D8", fontWeight: "bold" }
                : { color: "black" }
            }
            onClick={props.listUserSelected}
          >
            My Trips
          </p>
        </ListGroup.Item>
        <ListGroup.Item>
          <p className="text-danger" onClick={useLogout}>Log Out</p>
        </ListGroup.Item>
        <ListGroup.Item>
          <p className="text-danger">Delete Account</p>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}
export default UserSideBar;