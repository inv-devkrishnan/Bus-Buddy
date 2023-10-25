import { React, useState, useMemo } from "react";
import Layout from "../components/BusOwner/Layout";
import FormComponent from "../components/BusOwner/FormComponent";
import { ShowFormContext } from "../utils/ShowFormContext";
import { Grid } from "@mui/material";

export default function AddSeatDetails() {
  const [isClicked, setIsClicked] = useState(false);
  const [propsData, setPropsData] = useState(0);

  const contextValue = useMemo(
    () => ({ isClicked, setIsClicked, propsData, setPropsData }),
    [isClicked, setIsClicked, propsData, setPropsData]
  ); // since the object passed as the value prop to the Context provider changes every render

  return (
    <Grid container spacing={2}>
      <Grid item md={6} xs={12} sm={12}>
        <ShowFormContext.Provider value={contextValue}>
          <Layout />
        </ShowFormContext.Provider>
      </Grid>
      <Grid item md={6} xs={12} sm={12}>
        <ShowFormContext.Provider value={contextValue}>
          {isClicked && <FormComponent />}
        </ShowFormContext.Provider>
        {/* to render the form component outside the layout 
      but the isClicked value is determined by the sleeper component */}
      </Grid>
    </Grid>
  );
}
