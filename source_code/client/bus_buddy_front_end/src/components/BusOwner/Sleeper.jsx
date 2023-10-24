import { React, useState } from "react";

import { IconButton } from "@mui/material";

import SleeperImage from "../../assests/sleeper.png";
import { useNavigate } from "react-router-dom";

function Sleeper(position) {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(true);

  const handleClick = () => {
    setIsClicked(!isClicked);
    navigate("/", {
      state: { isClicked: isClicked, row: position.row, column: position.column },
    });
  };

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
