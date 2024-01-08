import { React,useContext } from "react";

import { Grid } from "@mui/material";

import FullSeaterLayout from "../../components/BusOwner/SeatComponents/Layouts/FullSeaterLayout";
import FormComponent from "../../components/BusOwner/SeatComponents/FormComponent";
import { AddSeatContext } from "../../utils/AddSeatContext";

export default function AddSeatDetails() {
  const { isClicked } = useContext(AddSeatContext);
  return (
    <Grid
      container
      m={2}
      spacing={2}
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Grid item md={8} xs={12} sm={12} lg={6}>
        <FullSeaterLayout />
      </Grid>

      <Grid item md={4} xs={12} sm={12} lg={6}>
        {isClicked && <FormComponent />}
        {/* to render the form component outside the layout 
      but the isClicked value is determined by the Seater component */}
      </Grid>
    </Grid>
  );
}
