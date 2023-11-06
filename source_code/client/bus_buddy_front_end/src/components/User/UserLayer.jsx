import { React, useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import UserSleeper from "./UserSleeper";
import { SeatContext } from "../../utils/SeatContext";

export default function UserLayer(props) {
  const { seatData } = useContext(SeatContext); // use context which contain the seat data
  const [nearFemale, setNearFemale] = useState(false); // true if current seat is near a female booked seat
  const [nearMale, setNearMale] = useState(false); // true if current seat is near a male booked seat
  useEffect(() => {
    // checks if nearby seat is booked by female
    let layerData = [];
    let loop = 0;
    while (loop < seatData.length) {
      let layerFromUiOrder = Math.floor(seatData[loop]?.seat_ui_order / 10);// to check whether the seat is in same layer
      if (layerFromUiOrder === props.row) {
        layerData.push(seatData[loop]);
      }

      if (
        layerData[1]?.booked[0]?.traveller_gender === 2 ||
        layerData[2]?.booked[0]?.traveller_gender === 2
      ) {
        setNearFemale(true);
      } else if (
        // checks if nearby seat is booked by male
        layerData[1]?.booked[0]?.traveller_gender === 1 ||
        layerData[2]?.booked[0]?.traveller_gender === 1
      ) {
        setNearMale(true);
      }

      loop++;
    }
  }, [props, seatData]);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Grid item xs={2}>
            <UserSleeper nearFemale={false} row={props.row} column={1} />
          </Grid>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}>
          <UserSleeper
            nearFemale={nearFemale}
            nearMale={nearMale}
            row={props.row}
            column={2}
          />
        </Grid>
        <Grid item xs={2}>
          <UserSleeper
            nearFemale={nearFemale}
            nearMale={nearMale}
            row={props.row}
            column={3}
          />
        </Grid>
      </Grid>
    </div>
  );
}
