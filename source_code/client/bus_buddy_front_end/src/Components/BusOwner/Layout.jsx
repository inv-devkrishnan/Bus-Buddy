import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import Layer from "./Layer";
import driver from "../../Assests/driver.png";

export default function Layout() {
  return (
    <div>
      <Grid container spacing={2}>
        <Card sx={{ width: 300 }}>
          <CardContent>
            <Grid container>
              <Grid item xs={9}></Grid>
              <Grid item xs={3}>
                {" "}
                <img src={driver} alt="driver" />
              </Grid>
            </Grid>
            <Layer />
            <Layer />
            <Layer />
            <Layer />
            <Layer />
          </CardContent>
        </Card>
        <Card sx={{ width: 300 }}>
          <CardContent>
            <Layer />
            <Layer />
            <Layer />
            <Layer />
            <Layer />
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}