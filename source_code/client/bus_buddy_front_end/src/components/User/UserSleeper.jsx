import { React, useContext, useEffect, useState, forwardRef } from "react";

import {
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import Selected from "../../assets/selectedSleeper.png";
import Sleeper from "../../assets/sleeper.png";
import FemaleSleeper from "../../assets/femaleSleeper.png";
import MaleSleeper from "../../assets/maleSleeper.png";
import { SeatContext } from "../../utils/SeatContext";

const Alert = forwardRef(function Alert(props, ref) {
  // function to show alert
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function UserSleeper(props) {
  const [select, setSelect] = useState(false); // to identify if seat is selected or not
  const { seatList, updateSeatList, seatData } = useContext(SeatContext); // seatlist and seat data from seatcontext
  const [seatOccupied, setSeatOccupied] = useState(false); // to identify if seat is occupied
  const [seatFemaleOccupied, setSeatFemaleOccupied] = useState(false); // to identify if seat is female occupied
  const [open, setOpen] = useState(false); // to show / hide the snackbar
  const [uiOrder, setUiOrder] = useState(0); // to find the ui order of a particular seat
  const [presentSeat, setPresentSeat] = useState([]); // for finding the current seat detail
  const [containerEl, setContainerEl] = useState(null); // for handling pop over

  useEffect(() => {
    // for finding seat ui order and the respective data
    setUiOrder(props.row * 10 + props.column); // for calculating respective seat ui order
    let loop = 0;
    while (loop < seatData.length) {
      if (seatData[loop]?.seat_ui_order === uiOrder) {
        // checks for the seat ui order and store it into seatData
        setPresentSeat(seatData[loop]);
      }
      loop++;
    }
  }, [props, seatData, uiOrder]);

  useEffect(() => {
    let loop = 0;

    while (loop < seatData.length) {
      if (
        seatData[loop]?.seat_ui_order === uiOrder &&
        seatData[loop]?.booked.length > 0
      ) {
        setSeatOccupied(true);
        // if booked field is not empty then seat is already booked
        if (seatData[loop]?.booked[0]?.traveller_gender === 2) {
          setSeatFemaleOccupied(true);
          break;
        } else {
          setSeatFemaleOccupied(false);
        }
        break;
      } else {
        setSeatOccupied(false);
      }
      loop++;
    }
  }, [seatData, uiOrder]);

  const handleClose = (reason) => {
    // function to close snackbar
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleSelect = () => {
    setSelect(!select);
    let selectedSeat = presentSeat;
    // gets details of nearby seat and set them if they are male or female only
    selectedSeat.female_only = props.nearFemale;
    selectedSeat.male_only = props.nearMale;
    if (seatList.includes(presentSeat)) {
      const newArray = seatList.filter((seat) => seat.id !== presentSeat.id);
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

  const handleMouseOver = (e) => {
    setContainerEl(e.currentTarget);
  };

  const handleMouseOut = () => {
    setContainerEl(null);
  };

  const PopOpen = Boolean(containerEl);

  return (
    <>
      {seatOccupied ? (
        <IconButton onClick={handleSelect} disabled>
          {seatFemaleOccupied ? (
            <img src={FemaleSleeper} alt="female booked" draggable="false" />
          ) : (
            <img src={MaleSleeper} alt="male booked" draggable="false" />
          )}
        </IconButton>
      ) : (
        <IconButton
          onClick={handleSelect}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          {select ? (
            <img src={Selected} alt="sleeper" draggable="false" />
          ) : (
            <img src={Sleeper} alt="selected" draggable="false" />
          )}
        </IconButton>
      )}

      <Popover
        sx={{
          pointerEvents: "none",
        }}
        open={PopOpen}
        anchorEl={containerEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={handleMouseOut}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>
          seat: {presentSeat.seat_number} <br />
          fare: ₹ {presentSeat.seat_cost} <br />
          type: {presentSeat.seat_type === 0 ? "Sleeper" : "Seater"}
        </Typography>
      </Popover>

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
