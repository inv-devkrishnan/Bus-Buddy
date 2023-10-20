import { React } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../Components/BusOwner/Layout";
import FormComponent from "../Components/BusOwner/FormComponent";

export default function AddSeatDetails() {
  const location = useLocation();
  const isClicked = location.state; //stores the value as true which is passed from sleeper

  return (
    <div className="container">
      <div className="component">
        <Layout />
      </div>
      <div className="component">
        {isClicked && <FormComponent />}
        {/* to render the form component outside the layout 
      but the isClicked value is determined by the sleeper component */}
      </div>
    </div>
  );
}
