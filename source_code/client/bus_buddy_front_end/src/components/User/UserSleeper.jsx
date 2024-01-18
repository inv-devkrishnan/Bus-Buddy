import { React, useContext, useEffect, useState, forwardRef } from "react";

import { IconButton, Popover, Typography } from "@mui/material";
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
    if (localStorage.getItem("seat_list")) {
      const existingSeatList = JSON.parse(localStorage.getItem("seat_list"));
      updateSeatList(existingSeatList);
      for (const seat of existingSeatList) {
        if (seat.seat_ui_order === props.row * 10 + props.column) {
          handleSelect();
          break;
        } else {
          console.log(seat);
        }
      }
    } else {
      console.log("no seat_list");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log((seatData));

  useEffect(() => {
    // for finding seat ui order and the respective data
    setUiOrder(props.row * 10 + props.column); // for calculating respective seat ui order
    const foundSeat = seatData.find((seat) => seat?.seat_ui_order === uiOrder);
    setPresentSeat(foundSeat || {});
  }, [props, seatData, uiOrder]);

  useEffect(() => {
    const foundSeat = seatData.find((seat) => seat?.seat_ui_order === uiOrder);

    if (foundSeat?.booked?.length > 0) {
      setSeatOccupied(true);
      setSeatFemaleOccupied(foundSeat.booked[0].traveller_gender === 2);
    } else {
      setSeatOccupied(false);
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
    const isSeatAlreadySelected = seatList.some(
      (seat) => seat.id === presentSeat.id
    );

    if (isSeatAlreadySelected) {
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
          data-testid="selected sleeper button"
        >
          {select ? (
            <img src={Selected} alt="selected" draggable="false" />
          ) : (
            <img src={Sleeper} alt="sleeper" draggable="false" />
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
        disableScrollLock
      >
        <Typography sx={{ p: 1 }}>
          seat: {presentSeat.seat_number} <br />
          fare: ₹ {presentSeat.seat_cost} <br />
          type: {presentSeat.seat_type === 0 ? "Seater" : "Sleeper"}
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
