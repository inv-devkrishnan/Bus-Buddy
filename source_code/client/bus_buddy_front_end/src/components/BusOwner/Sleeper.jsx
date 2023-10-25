import { React, useContext } from "react";
import { IconButton } from "@mui/material";
import SleeperImage from "../../assests/sleeper.png";
import { ShowFormContext } from "../../utils/ShowFormContext";

function Sleeper(props) {
  const { isClicked, setIsClicked, setPropsData } =
    useContext(ShowFormContext);

  const handleClick = () => {
    setIsClicked(!isClicked);
    setPropsData((props.row*10)+props.column)
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
      >
        <img src={SleeperImage} alt="sleeper" />
      </IconButton>
    </>
  );
}

export default Sleeper;
//Here in onClick the true or false when the sleeper is clicked
