import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

import { IconButton } from "@mui/material";
import Selected from "../../assests/selectedSleeper.png";
import Sleeper from "../../assests/sleeper.png";
import Booked from "../../assests/bookedSleeper.png";

function UserSleeper() {
  const [select, setSelect] = useState(false);
  const [open, setOpen] = useState(true);
  const [choice, setChoice] = useState(0);
  const navigate = useNavigate();

  const handleSelect = () => {
    setSelect(!select);
    console.log(choice);

    setOpen(!open);
    navigate("/user", { state: open });
  };


  return (
    <>
      <IconButton onClick={handleSelect}>
        {select ? (
          <img src={Selected} alt="sleeper" />
        ) : (
          <img src={Sleeper} alt="booked" />
        )}
      </IconButton>
    </>
  );
}

export default UserSleeper;
