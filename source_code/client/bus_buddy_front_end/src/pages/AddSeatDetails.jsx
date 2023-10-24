import { React } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/BusOwner/Layout";
import FormComponent from "../components/BusOwner/FormComponent";

export default function AddSeatDetails() {
  const location = useLocation();
  const isClicked = location.state.isClicked; //stores the value as true which is passed from sleeper
  const row = location.state.row;
  const column = location.state.column;

  return (
    <div className="container">
      <div className="component">
        <Layout />
      </div>
      <div className="component">
        {isClicked && <FormComponent row={row} column={column} />}
        {/* to render the form component outside the layout 
      but the isClicked value is determined by the sleeper component */}
      </div>
    </div>
  );
}
