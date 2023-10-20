import { React, useState } from "react";

import { IconButton } from "@mui/material";

import SleeperImage from "../../Assests/sleeper.png";
import { useNavigate } from "react-router-dom";

function Sleeper() {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(true);
  
  const handleClick = () => {
    setIsClicked(!isClicked)
    navigate("/", { state: isClicked })};

  return (
    <>
      <IconButton onClick={handleClick}>
        <img src={SleeperImage} alt="sleeper" />
      </IconButton>
    </>
  );
}

export default Sleeper;
//Here in onClick the path to Layout component is set and this pass true when the sleeper is clicked
