import { useLogout } from "../../utils/hooks/useLogout";
import "./SideBar.css";
import ListGroup from "react-bootstrap/ListGroup";
function SideBar(props) {
  const logout = useLogout();
  return (
    <div className="sidebar">
      <div className="header">
        <h2 className="text-light text-center pt-3">{props.heading}</h2>
      </div>
      <ListGroup>
        {props.options.map((option) => (
          <ListGroup.Item key={option.name}>
            <p
              style={
                option.state
                  ? { color: "#0275D8", fontWeight: "bold" }
                  : { color: "black" }
              }
              onClick={option.onChange}
            >
              {option.name}
            </p>
          </ListGroup.Item>
        ))}

        <ListGroup.Item>
          <p className="text-danger" onClick={logout}>
            Log Out
          </p>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}
export default SideBar;
