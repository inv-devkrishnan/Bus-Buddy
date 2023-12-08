import { React, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

import { IconButton, Popover, Typography } from "@mui/material";
import SleeperImage from "../../../assets/sleeper.png";
import SelectedSleeper from "../../../assets/selectedSleeper.png";
import AddedSleeper from "../../../assets/maleSleeper.png";
import { AddSeatContext } from "../../../utils/AddSeatContext";

function Sleeper(props) {
  const [select, setSelect] = useState(false); // flag for selecting sleeper
  const [hasAdded, setHasAdded] = useState(false); // flag to check data is added or not
  const [presentSeat, setPresentSeat] = useState([]); // for finding the current seat detail
  const [containerEl, setContainerEl] = useState(null); // for handling pop over

  const {
    updateIsClicked,
    updatePropsData,
    currentData,
    addSeatList,
    updateAddSeatList,
  } = useContext(AddSeatContext); // use context that for setting props data and button value
  useEffect(() => {
    // for checking seat details is added or not
    for (let seat of currentData) {
      setPresentSeat(seat);
      if (seat.seat_ui_order === props.row * 10 + props.column) {
        setHasAdded(true);
        break;
      } else {
        setHasAdded(false);
      }
    }
  }, [currentData, props]);

  const handleSelect = () => {
    // calls form and also set prop data for current seat
    //set propsData as (row*10+column). eg: row=10 and column=3 -> propsData=103
    updateIsClicked(true);
    updatePropsData(props.row * 10 + props.column);
    setSelect(true);
    if (!addSeatList.includes(props.row * 10 + props.column)) {
      updateAddSeatList([...addSeatList, props.row * 10 + props.column]);
    }
  };

  const handleMouseOver = (e) => {
    // for getting element while hovering
    setContainerEl(e.currentTarget);
  };

  const handleMouseOut = () => {
    // for removing element from state when not hovering
    setContainerEl(null);
  };

  const PopOpen = Boolean(containerEl); // if element then true

  return (
    <>
      {hasAdded ? (
        <IconButton
          disableRipple
          disableFocusRipple
          disableTouchRipple
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <div>
            <p>{props.row * 10 + props.column}</p>
            <img src={AddedSleeper} alt="sleeper" draggable="false" />
          </div>
        </IconButton>
      ) : (
        <IconButton onClick={handleSelect}>
          {select && addSeatList.includes(props.row * 10 + props.column) ? (
            <div>
              <p>{props.row * 10 + props.column}</p>
              <img src={SelectedSleeper} alt="sleeper" draggable="false" />
            </div>
          ) : (
            <div>
              <p>{props.row * 10 + props.column}</p>
              <img src={SleeperImage} alt="sleeper" draggable="false" />
            </div>
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
          seat: {presentSeat.seat_number}
          <br />
          type: {presentSeat.seat_type === 0 ? "Sleeper" : "Seater"}
          <br />
          deck: {presentSeat.deck === 0 ? "lower" : "upper"}
          <br />
          fare: ₹ {presentSeat.seat_cost}
        </Typography>
      </Popover>
    </>
  );
}

Sleeper.propTypes = {
  row: PropTypes.number,
  column: PropTypes.number,
};

export default Sleeper;
