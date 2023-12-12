import { React, useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import UserSleeper from "./UserSleeper";
import { SeatContext } from "../../utils/SeatContext";

export default function UserLayer(props) {
  const { seatData } = useContext(SeatContext); // use context which contain the seat data
  const [nearFemale, setNearFemale] = useState(false); // true if current seat is near a female booked seat
  const [nearMale, setNearMale] = useState(false); // true if current seat is near a male booked seat

  useEffect(() => {
    let layerData = []; // for storing seat data of same layer
    let hasMale = false;
    let hasFemale = false;

    for (let loop = 1; loop < seatData.length; loop++) {
      // Loop through the seat data
      const seat = seatData[loop];
      const seatUiOrder = seat?.seat_ui_order;
      const layerFromUiOrder = Math.floor(seatUiOrder / 10);

      if (layerFromUiOrder === props.row && seatUiOrder % 10 !== 1) {
        // grouping seats on the same layer but avoids the single seats
        layerData.push(seat);

        if (seat.booked.length > 0) {
          // Check if the current seat has been booked by a male or female traveler
          if (seat.booked[0].traveller_gender === 1) {
            hasMale = true;
            break;
          } else if (seat.booked[0].traveller_gender === 2) {
            hasFemale = true;
            break;
          }
        }
      }
    }

    if (layerData.length === 2 && hasMale) {
      // Male has booked nearby seats
      setNearMale(true);
    } else if (layerData.length === 2 && hasFemale) {
      // Female has booked nearby seats
      setNearFemale(true);
    }
  }, [props.row, seatData]);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Grid item xs={2}>
            <UserSleeper
              nearFemale={false}
              nearMale={false}
              row={props.row}
              column={1}
            />
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
