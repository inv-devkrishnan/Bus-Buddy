import { React, useContext, useState, useEffect } from "react";
import UserLayout from "../components/User/UserLayout";
import SeatDetailCard from "../components/User/SeatDetailCard";
import PickAndDrop from "../components/User/PickAndDrop";
import Grid from "@mui/material/Grid";

import { SeatContext } from "../utils/SeatContext";
import { Card } from "@mui/material";

export default function ViewSeatDetails(props) {
  const { seatList } = useContext(SeatContext);
  const [selectionModelPick, setSelectionModelPick] = useState([]); // for storing pick up point id
  const [selectionModelDrop, setSelectionModelDrop] = useState([]); // for stroring drop off point id
  const [selectedPickStop, setSelectedPickStop] = useState([]); // for storing pick up stop
  const [selectedDropStop, setSelectedDropStop] = useState([]); // for storing drop off stop

  useEffect(() => {
    localStorage.setItem("current_trip", JSON.stringify(props.currentTrip));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="m-3 p-3">
      <Grid
        container
        spacing={2}
        alignItems="flex-start"
        // justifyContent="space-between"
      >
        <Grid item md={12} sm={12} lg={4} xl={4}>
          <UserLayout
            trip={props.currentTrip?.data?.trip}
            startLocation={props?.startLocation}
            endLocation={props?.endLocation}
          />
        </Grid>

        <Grid item md={12} sm={12} lg={8} xl={8}>
          {seatList?.length || localStorage.getItem("seat_list") ? (
            <PickAndDrop
              selectionModelPick={selectionModelPick}
              setSelectionModelPick={setSelectionModelPick}
              selectionModelDrop={selectionModelDrop}
              setSelectionModelDrop={setSelectionModelDrop}
              setSelectedPickStop={setSelectedPickStop}
              setSelectedDropStop={setSelectedDropStop}
            />
          ) : null}
          {/* component renders only when a seat is selected */}
          <SeatDetailCard
            selectionModelPick={selectionModelPick}
            selectionModelDrop={selectionModelDrop}
            selectedPickStop={selectedPickStop}
            selectedDropStop={selectedDropStop}
            routeCost={props?.routeCost}
            gst={props?.gst}
          />
        </Grid>
      </Grid>
    </Card>
  );
}
