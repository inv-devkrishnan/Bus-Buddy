import { React, useContext, useEffect, useState } from "react";

import { IconButton } from "@mui/material";
import Selected from "../../assets/images/selectedSleeper.png";
import Sleeper from "../../assets/images/sleeper.png";
import FemaleSleeper from "../../assets/images/femaleSleeper.png";
import BookedSleeper from "../../assets/images/bookedSleeper.png";
import { SeatContext } from "../../utils/SeatContext";

function UserSleeper(props) {
  const [select, setSelect] = useState(false);
  const { seatList, updateSeatList } = useContext(SeatContext);
  const [seatOccupied, setSeatOccupied] = useState(false);
  const [seatFemaleOccupied, setSeatFemaleOccupied] = useState(false);

  useEffect(() => {
    if (props.seat.booked.length > 0) {
      setSeatOccupied(true);
      if (props.seat.booked[0].traveller_gender === 2) {
        
        setSeatFemaleOccupied(true);
      } else {
        setSeatFemaleOccupied(false);
      }
    } else {
      setSeatOccupied(false);
    }
  }, [props]);
  const handleSelect = () => {
    setSelect(!select);
    let selectedSeat = props.seat;
    selectedSeat["female_only"] = props.nearFemale;
    if (seatList.includes(props.seat)) {
      const newArray = seatList.filter((seat) => seat.id !== props.seat.id);
      updateSeatList(newArray);
    } else {
      let newArray = [...seatList, selectedSeat];
      updateSeatList(newArray);
    }
  };

  return (
    <>
      {seatOccupied ? (
        <IconButton onClick={handleSelect} disabled>
          {seatFemaleOccupied ? (
            <img src={FemaleSleeper} alt="female booked" />
          ) : (
            <img src={BookedSleeper} alt="male booked " />
          )}
        </IconButton>
      ) : (
        <IconButton onClick={handleSelect}>
          {select ? (
            <img src={Selected} alt="sleeper" />
          ) : (
            <img src={Sleeper} alt="selected" />
          )}
        </IconButton>
      )}
    </>
  );
}

export default UserSleeper;
