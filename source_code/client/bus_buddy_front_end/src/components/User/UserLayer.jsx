import { React, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import UserSleeper from "./UserSleeper";
export default function Layer(props) {
  const [nearFemale, setnearFemale] = useState(false); // true if current seat is near a female booked seat
  const [nearMale, setnearMale] = useState(false); // true if current seat is near a male booked seat
  useEffect(() => {
    // checks if nearby seat is booked by female
    if (
      props.seats[1]?.booked[0]?.traveller_gender === 2 ||
      props.seats[2]?.booked[0]?.traveller_gender === 2
    ) {
      setnearFemale(true);
    } else if (
      // checks if nearby seat is booked by male
      props.seats[1]?.booked[0]?.traveller_gender === 1 ||
      props.seats[2]?.booked[0]?.traveller_gender === 1
    ) {
      setnearMale(true);
    }
  }, [props]);
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Grid item xs={2}>
            <UserSleeper seat={props.seats[0]} nearFemale={false} />
          </Grid>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}>
          <UserSleeper
            seat={props.seats[1]}
            nearFemale={nearFemale}
            nearMale={nearMale}
          />
        </Grid>
        <Grid item xs={2}>
          <UserSleeper
            seat={props.seats[2]}
            nearFemale={nearFemale}
            nearMale={nearMale}
          />
        </Grid>
      </Grid>
    </div>
  );
}
