import { React, useState, useEffect, useContext } from "react";
import { IconButton } from "@mui/material";
import AddedSeater from "../../../assets/maleSeater.png";
import SelectedSeater from "../../../assets/selectedSeater.png";
import SeaterImage from "../../../assets/seater.png";
import { AddSeatContext } from "../../../utils/AddSeatContext";

function Seater(props) {
  const [select, setSelect] = useState(false);
  const [hasAdded, setHasAdded] = useState(false);
  const { updateIsClicked, propsData, updatePropsData, currentData } =
    useContext(AddSeatContext); // use context that for setting props data and button value

  useEffect(() => {
    // for checking seat details is added or not
    for (let i of currentData) {
      const seat = i;
      if (seat.seat_ui_order === props.row * 10 + props.column) {
        setHasAdded(true);
      }
    }
  }, [updatePropsData, props]);

  const handleSelect = () => {
    // calls form and also set prop data for current seat
    updateIsClicked(true);
    updatePropsData(props.row * 10 + props.column);
    setSelect(true);
  };
  //set propsData as (row*10+column). eg: row=10 and column=3 -> propsData=103

  return (
    <>
      {hasAdded ? (
        <IconButton onClick={handleSelect}>
          {select && propsData === props.row * 10 + props.column ? (
            <img src={SelectedSeater} alt="sleeper" />
          ) : (
            <img src={AddedSeater} alt="sleeper" />
          )}
        </IconButton>
      ) : (
        <IconButton onClick={handleSelect}>
          {select && propsData === props.row * 10 + props.column ? (
            <img src={SelectedSeater} alt="sleeper" />
          ) : (
            <img src={SeaterImage} alt="sleeper" />
          )}
        </IconButton>
      )}
    </>
  );
}

export default Seater;
