import { React, useContext } from "react";
import {useLocation} from 'react-router-dom';

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
      <Grid item md={12} xs={12} sm={12} lg={12}>
        <SeatDescription/>
      </Grid>
      <Grid item md={9} xs={12} sm={12} lg={6}>
        <FullSleeperLayout bus={location?.state}/>
      </Grid>

      <Grid item md={4} xs={12} sm={12} lg={6}>
        {isClicked && <FormComponent bus={location?.state}/>}
        {/* to render the form component outside the layout 
      but the isClicked value is determined by the sleeper component */}
      </Grid>
    </Grid>
  );
}
