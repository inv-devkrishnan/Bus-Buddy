import { React, useContext, useEffect, useState, forwardRef } from "react";

import { IconButton } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import Selected from "../../assets/images/selectedSleeper.png";
import Sleeper from "../../assets/images/sleeper.png";
import FemaleSleeper from "../../assets/images/femaleSleeper.png";
import MaleSleeper from "../../assets/images/maleSleeper.png";
import { SeatContext } from "../../utils/SeatContext";

const Alert = forwardRef(function Alert(props, ref) {
  // function to show alert
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function UserSleeper(props) {
  const [select, setSelect] = useState(false); // to identify if seat is selected or not
  const { seatList, updateSeatList } = useContext(SeatContext); // seatlist from seatcontext
  const [seatOccupied, setSeatOccupied] = useState(false); // to identify if seat is occupied
  const [seatFemaleOccupied, setSeatFemaleOccupied] = useState(false); // to identify if seat is female occupied
  const [open, setOpen] = useState(false); // to show / hide the snackbar

  useEffect(() => {
    if (props.seat.booked.length > 0) {
      setSeatOccupied(true); // if booked field is not empty then seat is already booked
      if (props.seat.booked[0].traveller_gender === 2) {
        setSeatFemaleOccupied(true); // set female occupied if gender =2
      } else {
        setSeatFemaleOccupied(false);
      }
    } else {
      setSeatOccupied(false);
    }
  }, [props]);

  const handleClose = (event, reason) => {
    // function to close snackbar
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleSelect = () => {
    setSelect(!select);
    let selectedSeat = props.seat;
    // gets details of nearby seat and set them if they are male or female only
    selectedSeat["female_only"] = props.nearFemale;
    selectedSeat["male_only"] = props.nearMale;
    if (seatList.includes(props.seat)) {
      const newArray = seatList.filter((seat) => seat.id !== props.seat.id);
      // update seat list array once seat is removed
      updateSeatList(newArray);
    } else {
      // shows snackbar if either the current seat is near a booked female or male seat
      if (props.nearFemale || props.nearMale) {
        setOpen(true);
      }
      let newArray = [...seatList, selectedSeat];
      // update seat list array once seat is selected
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
            <img src={MaleSleeper} alt="male booked" />
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
      <div>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="warning"
            sx={{ width: "100%" }}
          >
            {props.nearFemale && "Seat is reserved for female"}
            {props.nearMale && "Seat is reserved for male"}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default UserSleeper;
