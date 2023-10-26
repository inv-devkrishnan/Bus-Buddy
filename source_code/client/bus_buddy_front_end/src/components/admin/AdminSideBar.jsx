import { useLogout } from "../../utils/hooks/useLogout";
import "./AdminSideBar.css";
import ListGroup from "react-bootstrap/ListGroup";
function AdmindSideBar(props) {
  return (
    <div className="sidebar">
      <div className="header">
        <h2 className="text-light text-center pt-3">Admin Profile</h2>
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
            Profile
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
            List User
          </p>
        </ListGroup.Item>
        <ListGroup.Item>
          <p
            style={
              props.busSelect
                ? { color: "#0275D8", fontWeight: "bold" }
                : { color: "black" }
            }
            onClick={props.busSelected}
          >
            Bus Owner Approval
          </p>
        </ListGroup.Item>
        <ListGroup.Item>
          <p className="text-danger" onClick={useLogout}>Log Out</p>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}
export default AdmindSideBar;
