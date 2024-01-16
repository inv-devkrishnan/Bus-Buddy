import { React, useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import UserSleeper from "./UserSleeper";
import { SeatContext } from "../../utils/SeatContext";

export default function UserLayer(props) {
  const { seatData } = useContext(SeatContext); // use context which contain the seat data
  const [nearFemale, setNearFemale] = useState(false); // true if current seat is near a female booked seat
  const [nearMale, setNearMale] = useState(false); // true if current seat is near a male booked seat

  const processSeatData = (layerData) => {
    let hasMale = false;
    let hasFemale = false;

    for (const seat of layerData) {
      if (seat.booked.length > 0) {
        const gender = seat.booked[0].traveller_gender;

        if (gender === 1) {
          hasMale = true;
          break;
        } else if (gender === 2) {
          hasFemale = true;
          break;
        }
      }
    }

    return { hasMale, hasFemale };
  };

  const processLayerData = (layerData) => {
    if (layerData.length === 2) {
      const { hasMale, hasFemale } = processSeatData(layerData);

      if (hasMale) {
        setNearMale(true);
      } else if (hasFemale) {
        setNearFemale(true);
      }
    }
  };

  const processSeatUiOrder = (seat) => {
    const seatUiOrder = seat?.seat_ui_order;
    const layerFromUiOrder = Math.floor(seatUiOrder / 10);

    return { seatUiOrder, layerFromUiOrder };
  };

  useEffect(() => {
    let layerData = [];

    for (let loop = 1; loop < seatData.length; loop++) {
      const seat = seatData[loop];
      const { seatUiOrder, layerFromUiOrder } = processSeatUiOrder(seat);

      if (layerFromUiOrder === props.row && seatUiOrder % 10 !== 1) {
        // to assign seat data to the respective layer (also checks whether the seat is not in first column)
        layerData.push(seat);
      }
    }

    processLayerData(layerData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
