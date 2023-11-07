import { React, useContext } from "react";
import { IconButton } from "@mui/material";
import SeaterImage from "../../../assets/seater.png";
import { ShowFormContext } from "../../../utils/ShowFormContext";

function Seater(props) {
  const { isClicked, setIsClicked, setPropsData } = useContext(ShowFormContext);// use context for setting props data and button value

  const handleClick = () => {
    setIsClicked(!isClicked);
    setPropsData(props.row * 10 + props.column);
  }; // set true or false for isClicked useState
  //also set propsData as (row*10+column). eg: row=10 and column=3 -> propsData=103

  return (
    <IconButton onClick={handleClick}>
      <img src={SeaterImage} alt="sleeper" />
    </IconButton>
  );
}

export default Seater;
