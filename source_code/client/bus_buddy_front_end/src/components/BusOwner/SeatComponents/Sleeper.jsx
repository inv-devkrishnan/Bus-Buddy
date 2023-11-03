import { React, useContext } from "react";
import { IconButton } from "@mui/material";
import SleeperImage from "../../../assests/sleeper.png";
import { ShowFormContext } from "../../../utils/ShowFormContext";

function Sleeper(props) {
  const { isClicked, setIsClicked, setPropsData } = useContext(ShowFormContext);

  const handleClick = () => {
    setIsClicked(!isClicked);
    setPropsData(props.row * 10 + props.column);
  }; // set true or false for isClicked useState
  //also set propsData as (row*10+column). eg: row=10 and column=3 -> propsData=103

  return (
    <IconButton onClick={handleClick}>
      <img src={SleeperImage} alt="sleeper" />
    </IconButton>
  );
}

export default Sleeper;
