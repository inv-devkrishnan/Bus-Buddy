import { React, useContext, useState, useEffect } from "react";
import UserLayout from "../components/User/UserLayout";
import SeatDetailCard from "../components/User/SeatDetailCard";
import PickAndDrop from "../components/User/PickAndDrop";
import Grid from "@mui/material/Grid";

import { SeatContext } from "../utils/SeatContext";

export default function ViewSeatDetails(props) {
  const { seatList } = useContext(SeatContext);
  const [selectionModelPick, setSelectionModelPick] = useState([]); // for storing pick up point id
  const [selectionModelDrop, setSelectionModelDrop] = useState([]); // for stroring drop off point id

  useEffect(() => {
    localStorage.setItem("current_trip", JSON.stringify(props.currentTrip));
  }, []);

  return (
    <Grid
      container
      spacing={2}
      alignItems="flex-start"
      // justifyContent="space-between"
    >
      <Grid item md={12} sm={12} lg={4} xl={4}>
        <UserLayout trip={props.currentTrip.data.trip} />
      </Grid>

      <Grid item md={12} sm={12} lg={8} xl={8}>
        {seatList.length ? (
          <PickAndDrop
            selectionModelPick={selectionModelPick}
            setSelectionModelPick={setSelectionModelPick}
            selectionModelDrop={selectionModelDrop}
            setSelectionModelDrop={setSelectionModelDrop}
          />
        ) : null}
        {/* component renders only when a seat is selected */}
        <SeatDetailCard
          selectionModelPick={selectionModelPick}
          selectionModelDrop={selectionModelDrop}
        />
      </Grid>
    </Grid>
  );
}
