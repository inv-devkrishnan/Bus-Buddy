import { React, useContext } from "react";
import UserLayout from "../components/User/UserLayout";
import SeatDetailCard from "../components/User/SeatDetailCard";
import PickAndDrop from "../components/User/PickAndDrop";
import Grid from "@mui/material/Grid";

import { SeatContext } from "../utils/SeatContext";

export default function ViewSeatDetails(props) {
  const { seatList } = useContext(SeatContext);

  return (
      <Grid
        container
        m={1}
        p={1}
        spacing={2}
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Grid item md={12} xs={12} sm={12} lg={4} xl={4}>
          <UserLayout trip={props.trip} />
        </Grid>

        <Grid item md={12} xs={12} sm={12} lg={8} xl={8}>
          {seatList.length ? <PickAndDrop /> : null}
          {/* component renders only when a seat is selected */}
          <SeatDetailCard />
        </Grid>
      </Grid>
  );
}
