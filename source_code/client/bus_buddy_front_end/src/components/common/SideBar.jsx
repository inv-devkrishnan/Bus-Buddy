import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Accordion, AccordionHeader } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import { List } from "react-bootstrap-icons";
import "./SideBar.css";

function SideBar(props) {
  const [showDiv, setShowDiv] = useState(false);
  const [activeKey, setActiveKey] = useState("1");

  const handleAccordionToggle = (eventKey) => {
    setActiveKey(activeKey === eventKey ? null : eventKey);
  };

  const handleAccordionCollapse = () => {
    // function to collapse the Accordion
    setActiveKey(null);
  };

  useEffect(() => {
    // Function to handle window resize events
    const handleResize = () => {
      setShowDiv(window.innerWidth <= 768);
    };

    // Initial check and event listener setup
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const optionsList = (option) => {
    return (
      <Accordion.Item eventKey="0" key={option.name}>
        <ListGroup>
          <ListGroup.Item>
            <button
              data-testid={option.name}
              className="options"
              style={
                option.state
                  ? { color: "#0275D8", fontWeight: "bold" }
                  : { color: "black" }
              }
              onClick={() => {
                option.onChange();
                handleAccordionCollapse();
              }}
            >
              {option.name}
            </button>
          </ListGroup.Item>
        </ListGroup>
      </Accordion.Item>
    );
  };
  return (
    <div id="sidebar" className="sidebar">
      <div className="header">
        <h2 className="text-light text-center pt-3">{props.heading}</h2>
      </div>
      {showDiv ? (
        <Accordion flush activeKey={activeKey} onSelect={handleAccordionToggle}>
          <AccordionHeader>
            <List size="25"></List>
            <span className="fw-bold ms-2">Menu</span>
          </AccordionHeader>
          <AccordionBody>
            {props.options.map((option) => optionsList(option))}
          </AccordionBody>
        </Accordion>
      ) : (
        <>{props.options.map((option) => optionsList(option))}</>
      )}
    </div>
  );
}
SideBar.propTypes = {
  options: PropTypes.array,
  heading: PropTypes.string,
};
export default SideBar;
