import { React, useState, useMemo } from "react";
import SingleSeaterDoubleSleeperLayout from "../components/BusOwner/SeatDetails/Layouts/SingleSeaterDoubleSleeperLayout";
import FormComponent from "../components/BusOwner/SeatDetails/FormComponent";
import { ShowFormContext } from "../utils/ShowFormContext";
import { Grid } from "@mui/material";

export default function SingleSeaterDoubleSleeperDetails() {
  const [isClicked, setIsClicked] = useState(false);
  const [propsData, setPropsData] = useState(0);

  const contextValue = useMemo(
    () => ({ isClicked, setIsClicked, propsData, setPropsData }),
    [isClicked, setIsClicked, propsData, setPropsData]
  ); // since the object passed as the value prop to the Context provider changes every render

  return (
    <Grid
      container
      m={2}
      spacing={2}
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Grid item md={8} xs={12} sm={12} lg={6}>
        <ShowFormContext.Provider value={contextValue}>
          <SingleSeaterDoubleSleeperLayout />
        </ShowFormContext.Provider>
      </Grid>
      <Grid item md={4} xs={12} sm={12} lg={6}>
        <ShowFormContext.Provider value={contextValue}>
          {isClicked && <FormComponent />}
        </ShowFormContext.Provider>
        {/* to render the form component outside the layout 
      but the isClicked value is determined by the Seater component */}
      </Grid>
    </Grid>
  );
}
