import { React, useState } from "react";

import { IconButton } from "@mui/material";

import Sleeper from "../../Assests/sleeper.png";
import Booked from "../../Assests/bookedSleeper.png";

import { useNavigate } from "react-router-dom";

function UserSleeper() {
  const [select, setSelect] = useState(false);
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState(0);
  const navigate = useNavigate();

  const handleSelect = () => {
    setSelect(!select);
    if (!select) {
      setChoice(choice + 1);
    } else {
      setChoice(choice - 1);
    }
  };
  console.log(choice);

  return (
    <>
      <IconButton onClick={handleSelect}>
        {select ? (
          <img src={Booked} alt="sleeper" />
        ) : (
          <img src={Sleeper} alt="booked" />
        )}
      </IconButton>
    </>
  );
}

export default UserSleeper;
