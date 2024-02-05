import { React, useContext } from "react";
import { useLocation } from "react-router-dom";

import { Grid } from "@mui/material";

import FullSleeperLayout from "../../components/BusOwner/SeatComponents/Layouts/FullSleeperLayout";
import FormComponent from "../../components/BusOwner/SeatComponents/FormComponent";
import { AddSeatContext } from "../../utils/AddSeatContext";
import SeatDescription from "../../components/BusOwner/SeatComponents/SeatDescription";

export default function FullSleeperDetails() {
  const { isClicked } = useContext(AddSeatContext);
  const location = useLocation();
  return (
    <Grid
      container
      m={2}
      spacing={2}
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Grid item xs={12} md={12} lg={12}>
        <SeatDescription />
      </Grid>
      <Grid item xs={12} md={12} lg={3}>
        <FullSleeperLayout bus={location?.state?.id} />
      </Grid>

      <Grid item xs={12} md={12} lg={9}>
        {isClicked && (
          <FormComponent
            bus={location?.state?.id}
            seatType={location?.state?.bus_seat_type}
          />
        )}
        {/* to render the form component outside the layout 
      but the isClicked value is determined by the sleeper component */}
      </Grid>
    </Grid>
  );
}
